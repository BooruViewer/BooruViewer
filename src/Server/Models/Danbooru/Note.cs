using System;

namespace BooruViewer.Models.Danbooru
{
    public class Note
    {
        public UInt64 Id { get; set; }
        public UInt64 PostId { get; set; }

        public Int64 X { get; set; }
        public Int64 Y { get; set; }
        public UInt64 Width { get; set; }
        public UInt64 Height { get; set; }

        public Boolean IsActive { get; set; }

        public String Body { get; set; }

        public UInt64 Version { get; set; }

        public UInt64 CreatorId { get; set; }
        public String CreatorName { get; set; }

        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}
