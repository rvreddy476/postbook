using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PostBook.Auth.Application.Interfaces;
using PostBook.Auth.Domain.Interfaces;
using PostBook.Auth.Infrastructure.Persistence;
using PostBook.Auth.Infrastructure.Persistence.Repositories;
using PostBook.Auth.Infrastructure.Services;

namespace PostBook.Auth.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Database - Use DATABASE_URL environment variable if available
        var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL")
            ?? configuration.GetConnectionString("DefaultConnection") 
            ?? throw new InvalidOperationException("Connection string not found. Set DATABASE_URL environment variable or DefaultConnection in appsettings.json");

        // Convert PostgreSQL URL to Npgsql connection string format
        var connectionString = ConvertPostgresUrl(databaseUrl);

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString));

        // Repositories
        services.AddScoped<IUserRepository, UserRepository>();

        // Services
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

        // JWT Settings - Manual binding
        var jwtSettings = new JwtSettings
        {
            SecretKey = configuration["JwtSettings:SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not found"),
            Issuer = configuration["JwtSettings:Issuer"] ?? throw new InvalidOperationException("JWT Issuer not found"),
            Audience = configuration["JwtSettings:Audience"] ?? throw new InvalidOperationException("JWT Audience not found"),
            ExpirationMinutes = int.Parse(configuration["JwtSettings:ExpirationMinutes"] ?? "60"),
            RefreshTokenExpirationDays = int.Parse(configuration["JwtSettings:RefreshTokenExpirationDays"] ?? "7")
        };
        services.AddSingleton(Microsoft.Extensions.Options.Options.Create(jwtSettings));

        return services;
    }

    private static string ConvertPostgresUrl(string url)
    {
        // If it's already in Npgsql format (contains Host=), return as-is
        if (url.Contains("Host=", StringComparison.OrdinalIgnoreCase))
            return url;

        // Parse PostgreSQL URL format: postgresql://user:password@host:port/database?sslmode=require
        var uri = new Uri(url);
        var userInfo = uri.UserInfo.Split(':');
        var username = userInfo[0];
        var password = userInfo.Length > 1 ? userInfo[1] : "";
        var host = uri.Host;
        var port = uri.Port > 0 ? uri.Port : 5432;
        var database = uri.AbsolutePath.TrimStart('/');

        // Parse query parameters
        var query = System.Web.HttpUtility.ParseQueryString(uri.Query);
        var sslMode = query["sslmode"] ?? "require";

        // Build Npgsql connection string
        var builder = new Npgsql.NpgsqlConnectionStringBuilder
        {
            Host = host,
            Port = port,
            Database = database,
            Username = username,
            Password = password,
            SslMode = Npgsql.SslMode.Require
        };

        return builder.ConnectionString;
    }
}
