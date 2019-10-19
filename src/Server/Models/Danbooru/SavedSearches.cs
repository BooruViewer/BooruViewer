using System;
using System.Collections.Generic;

namespace BooruViewer.Models.Danbooru
{
    public class SavedSearches
    {
        public Int64 Id { get; set; }
        public Int64 UserId { get; set; }
        public String Query { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
        public List<String> Labels { get; set; }
    }
}
