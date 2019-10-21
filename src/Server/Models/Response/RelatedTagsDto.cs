using System.Collections.Generic;

namespace BooruViewer.Models.Response
{
    public class RelatedTagsDto
    {
        public ICollection<TagDto> Tags { get; set; }
    }
}
