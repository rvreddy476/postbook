using AutoMapper;
using PostBook.Auth.Application.DTOs;
using PostBook.Auth.Domain.Entities;

namespace PostBook.Auth.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email.Value))
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber != null ? src.PhoneNumber.Value : null))
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));
    }
}
