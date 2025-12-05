using FluentValidation;

namespace PostBook.Auth.Application.Commands.Login;

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.Identifier)
            .NotEmpty().WithMessage("Email or username is required");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required");
    }
}
