using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using PostBook.Auth.Application.Behaviors;
using System.Reflection;

namespace PostBook.Auth.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });

        services.AddAutoMapper(Assembly.GetExecutingAssembly());
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        return services;
    }
}
