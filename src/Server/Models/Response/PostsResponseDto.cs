using System.Collections.Generic;
using BooruViewer.Models.Response.Posts;

namespace BooruViewer.Models.Response
{
    public class PostsResponseDto
    {
        public SourceBooru SourceBooru { get; }
        public IEnumerable<PostDto> Posts { get; }

        public PostsResponseDto(SourceBooru sourceBooru, IEnumerable<PostDto> posts)
        {
            this.SourceBooru = sourceBooru;
            this.Posts = posts;
        }
    }
}
