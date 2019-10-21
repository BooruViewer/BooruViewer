using System;

namespace BooruViewer.Models.Response
{
    public class TagDto
    {
        public String Name { get; set; }
        public TagTypes Type { get; set; }

        public TagDto(String name, TagTypes type)
        {
            this.Name = name;
            this.Type = type;
        }
    }
}
