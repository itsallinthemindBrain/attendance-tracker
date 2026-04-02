using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AttendanceTracker.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UseAuthUserId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AttendanceRecords_Employees_EmployeeId",
                table: "AttendanceRecords");

            migrationBuilder.DropForeignKey(
                name: "FK_TrainingActivities_Employees_EmployeeId",
                table: "TrainingActivities");

            migrationBuilder.DropIndex(
                name: "IX_TrainingActivities_EmployeeId",
                table: "TrainingActivities");

            migrationBuilder.DropIndex(
                name: "IX_AttendanceRecords_EmployeeId",
                table: "AttendanceRecords");

            migrationBuilder.DropColumn(
                name: "EmployeeId",
                table: "TrainingActivities");

            migrationBuilder.DropColumn(
                name: "EmployeeId",
                table: "AttendanceRecords");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "TrainingActivities",
                type: "TEXT",
                maxLength: 450,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "AttendanceRecords",
                type: "TEXT",
                maxLength: 450,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingActivities_UserId",
                table: "TrainingActivities",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AttendanceRecords_UserId",
                table: "AttendanceRecords",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TrainingActivities_UserId",
                table: "TrainingActivities");

            migrationBuilder.DropIndex(
                name: "IX_AttendanceRecords_UserId",
                table: "AttendanceRecords");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "TrainingActivities");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "AttendanceRecords");

            migrationBuilder.AddColumn<int>(
                name: "EmployeeId",
                table: "TrainingActivities",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EmployeeId",
                table: "AttendanceRecords",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TrainingActivities_EmployeeId",
                table: "TrainingActivities",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_AttendanceRecords_EmployeeId",
                table: "AttendanceRecords",
                column: "EmployeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_AttendanceRecords_Employees_EmployeeId",
                table: "AttendanceRecords",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TrainingActivities_Employees_EmployeeId",
                table: "TrainingActivities",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
