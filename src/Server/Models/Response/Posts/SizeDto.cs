using System;

namespace BooruViewer.Models.Response.Posts
{
    public class SizeDto
    {
        public UInt64 Width { get; set; }
        public UInt64 Height { get; set; }

        public SizeDto(UInt64 width, UInt64 height)
        {
            this.Width = width;
            this.Height = height;
        }
    }
}
