using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace BooruViewer.Models.Danbooru
{
    public class AutoComplete
    {
        public String Name { get; set; }
        public UInt64 PostCount { get; set; }
        [JsonProperty("category")]
        public TagType Type { get; set; }
    }
}
