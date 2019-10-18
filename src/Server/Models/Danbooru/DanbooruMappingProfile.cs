using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using BooruViewer.Models.Response;
using BooruViewer.Models.Response.AutoComplete;
using BooruViewer.Models.Response.Posts;

namespace BooruViewer.Models.Danbooru
{
    public class DanbooruMappingProfile : AutoMapper.Profile
    {
        public DanbooruMappingProfile()
        {
            var tagType2TagTypesConverter = new TagTypeToTagTypesValueConverter();

            this.CreateMap<Post, PostDto>()
                .ForMember(dto => dto.ChildIds,
                    opts => opts.ConvertUsing(new IdCollectionFromStringValueConverter(), src => src.ChildrenIds))
                .ForMember(dto => dto.Tags,
                    opts => opts.ConvertUsing(new TagDtoCollectionFromPostValueConverter(), src => src))
                .ForMember(dto => dto.Source,
                    opts => opts.ConvertUsing(new SourceDtoFromPostValueConverter(), src => src))
                .ForMember(dto => dto.Files,
                    opts => opts.ConvertUsing(new FileDtoFromPostValueConverter(), src => src))
                .ForMember(dto => dto.Rating,
                    opts => opts.ConvertUsing(new RatingValueConverter(), src => src.Rating))
                .ForMember(dto => dto.IsVisible,
                    opts => opts.MapFrom(src => !String.IsNullOrWhiteSpace(src.FileUrl)))
                .ForMember(dto => dto.Hash,
                    opts => opts.MapFrom(src => src.Md5))
                .ForMember(dto => dto.Favourites,
                    opts => opts.MapFrom(src => src.FavCount))
                .ForMember(dto => dto.IsFavourited,
                    opts => opts.MapFrom(src => src.IsFavorited))
                .ForMember(dto => dto.UploadedAt,
                    opts => opts.MapFrom(src => src.CreatedAt))
                .ForMember(dto => dto.LastModifiedAt,
                    opts => opts.MapFrom(src => src.UpdatedAt))
                .ForMember(dto => dto.HasNotes,
                    opts => opts.MapFrom(src => src.LastNotedAt.HasValue))
                .ForMember(dto => dto.HasSound,
                    opts => opts.MapFrom(src => src.TagString.Contains("video_with_sound") || src.TagString.Contains("flash_with_sound")))
                .ForMember(dto => dto.Size,
                    opts => opts.MapFrom(src => new SizeDto(src.ImageWidth, src.ImageHeight)))
                .ForMember(dto => dto.Uploader,
                    opts => opts.MapFrom(src =>
                        new UploaderDto(src.UploaderName, $"https://danbooru.donmai.us/users/{src.UploaderId}")));

            this.CreateMap<AutoComplete, AutoCompleteDto>()
                .ForMember(dto => dto.Count,
                    opts => opts.MapFrom(src => src.PostCount))
                .ForMember(dto => dto.Type,
                    opts => opts.ConvertUsing(tagType2TagTypesConverter, src => src.Type));

            this.CreateMap<Note, NoteDto>();

            this.CreateMap<RelatedTags, RelatedTagsDto>()
                .ForMember(dto => dto.Tags,
                    opts => opts.ConvertUsing(new AbortionArrayOfArrayOfStringAndIntConverter(tagType2TagTypesConverter), src => src));
        }

        private class AbortionArrayOfArrayOfStringAndIntConverter : IValueConverter<RelatedTags, ICollection<TagDto>>
        {
            private TagTypeToTagTypesValueConverter _tagTypeConverter;

            public AbortionArrayOfArrayOfStringAndIntConverter(TagTypeToTagTypesValueConverter tagTypeConverter)
            {
                this._tagTypeConverter = tagTypeConverter;
            }

            public ICollection<TagDto> Convert(RelatedTags sourceMember, ResolutionContext context)
            {
                var items = sourceMember.Tags.Select(t => (name: t[0] as String, type: t[1] as Int64?));
                var results = new List<TagDto>();

                foreach (var (name, type) in items)
                {
                    var tagType = (TagType) type.Value;
                    results.Add(new TagDto(name, this._tagTypeConverter.Convert(tagType, null)));
                }

                return results;
            }
        }

        private class SourceDtoFromPostValueConverter : IValueConverter<Post, SourceDto>
        {
            public SourceDto Convert(Post sourceMember, ResolutionContext context)
            {
                var source = sourceMember.Source;
                if (!Uri.TryCreate(source, UriKind.Absolute, out var sourceUrl))
                    return !String.IsNullOrWhiteSpace(source) ? new SourceDto(source, null) : null;
                return new SourceDto(sourceUrl.Host, sourceUrl.ToString());
            }
        }

        private class FileDtoFromPostValueConverter : IValueConverter<Post, FilesDto>
        {
            public FilesDto Convert(Post source, ResolutionContext context)
            {
                // TODO: Handle Ugoira Frame Data thingys. Aka: Ensure that the Large File is the .webm....
                // Maybe even consider making the original the video file itself, since there isn't much utility in a .zip

                // This is a shortcut to the PostDto.IsVisible.
                if (String.IsNullOrWhiteSpace(source.FileUrl))
                    return null;

                String CreateProxyUrl(String input)
                {
                    var uri = new Uri(input);
                    var subdomain = uri.Host.Split('.', StringSplitOptions.RemoveEmptyEntries)[0];
                    var parts = uri.AbsolutePath.Split('/', StringSplitOptions.RemoveEmptyEntries);

                    return $"{subdomain}:{String.Join(':', parts)}";
                }

                var previewUrl = source.LargeFileUrl;
                var originalUrl = CreateProxyUrl(source.FileUrl);
                if (!source.HasLarge)
                    previewUrl = originalUrl;
                else previewUrl = CreateProxyUrl(previewUrl);

                return new FilesDto(source.PreviewFileUrl, previewUrl, originalUrl, source.FileSize);
            }
        }

        private class RatingValueConverter : IValueConverter<String, Rating>
        {
            public Rating Convert(String sourceMember, ResolutionContext context)
            {
                switch (sourceMember)
                {
                    case "s":
                        return Rating.Safe;
                    case "q":
                        return Rating.Questionable;
                    case "e":
                        return Rating.Explicit;
                    default:
                        // Unknown values will be considered explicit
                        return Rating.Explicit;
                }
            }
        }

        private class TagDtoCollectionFromPostValueConverter : IValueConverter<Post, ICollection<TagDto>>
        {
            public ICollection<TagDto> Convert(Post sourceMember, ResolutionContext context)
            {
                Func<String, TagDto> GenFunc(TagTypes type)
                    => tag => new TagDto(tag, type);

                String[] Split(String input)
                    => input.Split(' ', StringSplitOptions.RemoveEmptyEntries);

                return Split(sourceMember.TagStringCopyright).Select(GenFunc(TagTypes.Copyright))
                    .Concat(Split(sourceMember.TagStringCharacter).Select(GenFunc(TagTypes.Character)))
                    .Concat(Split(sourceMember.TagStringArtist).Select(GenFunc(TagTypes.Artist)))
                    .Concat(Split(sourceMember.TagStringGeneral).Select(GenFunc(TagTypes.General)))
                    .Concat(Split(sourceMember.TagStringMeta).Select(GenFunc(TagTypes.Meta)))
                    .ToArray();
            }
        }

        private class IdCollectionFromStringValueConverter : IValueConverter<String, ICollection<UInt64>>
        {
            public ICollection<UInt64> Convert(String input, ResolutionContext context)
            {
                if (String.IsNullOrWhiteSpace(input))
                    return new List<UInt64>();

                var ids = input.Split(' ', StringSplitOptions.RemoveEmptyEntries);
                return ids.Length > 0 ? ids.Select(id => UInt64.Parse(id)).ToList() : new List<UInt64>();
            }
        }

        private class TagTypeToTagTypesValueConverter : IValueConverter<TagType, TagTypes>
        {
            public TagTypes Convert(TagType type, ResolutionContext context)
                => Enum.Parse<TagTypes>(type.ToString(), true);
        }
    }
}
