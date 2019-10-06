using System;

namespace BooruViewer.Models.Response.AutoComplete
{
    public class AutoCompleteDto
    {
        public String Name { get; set; }
        public TagTypes Type { get; set; }
        public UInt64 Count { get; set; }
    }
}
