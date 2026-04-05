#!/usr/bin/env python3
"""
Publishes GitHub Actions test results (TRX + JUnit XML) to Azure DevOps Test Hub.

Required environment variables:
  AZURE_DEVOPS_ORG      - Azure DevOps organization name (e.g. KingDotOrg)
  AZURE_DEVOPS_PROJECT  - Azure DevOps project name (e.g. AttendanceTracker)
  AZURE_DEVOPS_PAT      - Personal Access Token with Test Read & Write scope

Optional environment variables:
  GITHUB_RUN_ID         - GitHub Actions run ID (defaults to 'unknown')
  BACKEND_TRX           - Path to backend .trx file (default: TestResults/test-results-backend.trx)
  FRONTEND_XML          - Path to frontend JUnit XML (default: test-results/test-results-frontend.xml)
"""

import base64
import json
import os
import sys
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from glob import glob
from pathlib import Path
import urllib.error
import urllib.request


def _get_required(name: str) -> str:
    val = os.environ.get(name, '').strip()
    if not val:
        print(f'ERROR: Required environment variable {name} is not set.', file=sys.stderr)
        sys.exit(1)
    return val


ORG = _get_required('AZURE_DEVOPS_ORG')
PROJECT = _get_required('AZURE_DEVOPS_PROJECT')
PAT = _get_required('AZURE_DEVOPS_PAT')
BUILD_ID = os.environ.get('GITHUB_RUN_ID', 'unknown')
BACKEND_TRX = os.environ.get('BACKEND_TRX', 'TestResults/test-results-backend.trx')
FRONTEND_XML = os.environ.get('FRONTEND_XML', 'test-results/test-results-frontend.xml')

BASE_URL = f'https://dev.azure.com/{ORG}/{PROJECT}/_apis/test'
_credentials = base64.b64encode(f':{PAT}'.encode()).decode()
_headers = {
    'Authorization': f'Basic {_credentials}',
    'Content-Type': 'application/json',
}


def ado_request(method: str, url: str, data=None) -> dict:
    body = json.dumps(data).encode() if data is not None else None
    req = urllib.request.Request(url, data=body, headers=_headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as exc:
        msg = exc.read().decode()
        print(f'Azure DevOps API error {exc.code} [{method} {url}]: {msg}', file=sys.stderr)
        raise


def parse_trx(path: str) -> list[dict]:
    """Parse a .NET TRX file and return ADO-shaped test result dicts."""
    tree = ET.parse(path)
    root = tree.getroot()
    ns = {'t': 'http://microsoft.com/schemas/VisualStudio/TeamTest/2010'}

    results = []
    for r in root.findall('.//t:UnitTestResult', ns):
        outcome = r.get('outcome', 'Failed')
        duration_str = r.get('duration', '00:00:00.0000000')

        # duration format: HH:MM:SS.fffffff
        parts = duration_str.split(':')
        secs = float(parts[2]) if len(parts) == 3 else 0.0
        duration_ms = int(secs * 1000)

        error_msg = ''
        stack_trace = ''
        output = r.find('t:Output', ns)
        if output is not None:
            error_info = output.find('t:ErrorInfo', ns)
            if error_info is not None:
                msg_el = error_info.find('t:Message', ns)
                st_el = error_info.find('t:StackTrace', ns)
                error_msg = (msg_el.text or '') if msg_el is not None else ''
                stack_trace = (st_el.text or '') if st_el is not None else ''

        results.append({
            'testCaseTitle': r.get('testName', 'Unknown'),
            'automatedTestName': r.get('testName', 'Unknown'),
            'outcome': 'Passed' if outcome == 'Passed' else 'Failed',
            'durationInMs': duration_ms,
            'errorMessage': error_msg,
            'stackTrace': stack_trace,
        })
    return results


def parse_junit(path: str) -> list[dict]:
    """Parse a JUnit XML file and return ADO-shaped test result dicts."""
    tree = ET.parse(path)
    root = tree.getroot()

    # Handle both <testsuites> wrapper and bare <testsuite> root
    suites = root.findall('.//testsuite') if root.tag == 'testsuites' else [root]

    results = []
    for suite in suites:
        for tc in suite.findall('testcase'):
            classname = tc.get('classname', '')
            name = tc.get('name', 'Unknown')
            full_name = f'{classname}.{name}' if classname else name
            duration_ms = int(float(tc.get('time', '0')) * 1000)

            failure = tc.find('failure')
            error = tc.find('error')
            skipped = tc.find('skipped')

            if failure is not None:
                outcome = 'Failed'
                error_msg = failure.get('message', '')
                stack_trace = (failure.text or '').strip()
            elif error is not None:
                outcome = 'Failed'
                error_msg = error.get('message', '')
                stack_trace = (error.text or '').strip()
            elif skipped is not None:
                outcome = 'NotExecuted'
                error_msg = ''
                stack_trace = ''
            else:
                outcome = 'Passed'
                error_msg = ''
                stack_trace = ''

            results.append({
                'testCaseTitle': full_name,
                'automatedTestName': full_name,
                'outcome': outcome,
                'durationInMs': duration_ms,
                'errorMessage': error_msg,
                'stackTrace': stack_trace,
            })
    return results


def load_results() -> list[dict]:
    all_results: list[dict] = []

    # Backend: find TRX via glob in case dotnet test added a GUID subfolder
    trx_candidates = glob(BACKEND_TRX) or glob('TestResults/**/*.trx', recursive=True)
    if trx_candidates:
        trx_path = trx_candidates[0]
        try:
            backend = parse_trx(trx_path)
            print(f'  Backend ({trx_path}): {len(backend)} tests')
            all_results.extend(backend)
        except Exception as exc:  # noqa: BLE001
            print(f'  Warning: could not parse backend TRX — {exc}', file=sys.stderr)
    else:
        print(f'  Warning: no TRX file found at {BACKEND_TRX}', file=sys.stderr)

    # Frontend: JUnit XML
    if Path(FRONTEND_XML).exists():
        try:
            frontend = parse_junit(FRONTEND_XML)
            print(f'  Frontend ({FRONTEND_XML}): {len(frontend)} tests')
            all_results.extend(frontend)
        except Exception as exc:  # noqa: BLE001
            print(f'  Warning: could not parse frontend XML — {exc}', file=sys.stderr)
    else:
        print(f'  Warning: frontend XML not found at {FRONTEND_XML}', file=sys.stderr)

    return all_results


def main() -> None:
    print('=== Publishing test results to Azure DevOps ===')
    print(f'  Org: {ORG}  Project: {PROJECT}  Build: {BUILD_ID}')

    results = load_results()
    if not results:
        print('No test results to publish. Exiting.', file=sys.stderr)
        sys.exit(1)

    # Create test run
    run_name = (
        f'GitHub Actions #{BUILD_ID} — '
        f'{datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")}'
    )
    run = ado_request('POST', f'{BASE_URL}/runs?api-version=7.0', {
        'name': run_name,
        'isAutomated': True,
        'state': 'InProgress',
    })
    run_id = run['id']
    print(f'  Created test run ID: {run_id}')

    # Post results in batches (Azure DevOps max 1000 per request)
    batch_size = 1000
    for start in range(0, len(results), batch_size):
        batch = results[start:start + batch_size]
        ado_request('POST', f'{BASE_URL}/runs/{run_id}/results?api-version=7.0', batch)
        print(f'  Posted batch {start // batch_size + 1}: {len(batch)} results')

    # Complete the run
    ado_request('PATCH', f'{BASE_URL}/runs/{run_id}?api-version=7.0', {'state': 'Completed'})

    passed = sum(1 for r in results if r['outcome'] == 'Passed')
    failed = sum(1 for r in results if r['outcome'] == 'Failed')
    print(f'  Done — {passed} passed, {failed} failed out of {len(results)} total')
    print(f'  View: https://dev.azure.com/{ORG}/{PROJECT}/_testManagement/runs?runId={run_id}')

    if failed:
        sys.exit(1)


if __name__ == '__main__':
    main()
