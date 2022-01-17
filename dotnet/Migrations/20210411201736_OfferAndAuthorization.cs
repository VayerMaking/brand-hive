﻿using Microsoft.EntityFrameworkCore.Migrations;

namespace dotnet.Migrations
{
    public partial class OfferAndAuthorization : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "role",
                table: "Users",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "role",
                table: "Users");
        }
    }
}
