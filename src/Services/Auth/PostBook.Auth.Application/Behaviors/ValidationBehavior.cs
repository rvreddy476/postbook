using FluentValidation;
using MediatR;
using PostBook.Auth.Application.Common;

namespace PostBook.Auth.Application.Behaviors;

public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (!_validators.Any())
        {
            return await next();
        }

        var context = new ValidationContext<TRequest>(request);

        var validationResults = await Task.WhenAll(
            _validators.Select(v => v.ValidateAsync(context, cancellationToken)));

        var failures = validationResults
            .SelectMany(r => r.Errors)
            .Where(f => f != null)
            .ToList();

        if (failures.Any())
        {
            var errorMessages = string.Join("; ", failures.Select(f => f.ErrorMessage));
            
            // Check if TResponse is Result<T>
            var responseType = typeof(TResponse);
            if (responseType.IsGenericType && responseType.GetGenericTypeDefinition() == typeof(Result<>))
            {
                var resultType = responseType.GetGenericArguments()[0];
                var failureMethod = typeof(Result<>).MakeGenericType(resultType).GetMethod("Failure");
                return (TResponse)failureMethod!.Invoke(null, new object[] { errorMessages })!;
            }

            throw new ValidationException(failures);
        }

        return await next();
    }
}
