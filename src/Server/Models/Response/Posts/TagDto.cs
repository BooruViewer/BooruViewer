using System;
using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace BooruViewer.Models.Response.Posts
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
