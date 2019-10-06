using System;
using System.IO;

namespace BooruViewer.Models.Response.Posts
{
    public class FilesDto
    {
        private static String[] VideoExtensions =
        {
            ".mp4", ".webm", ".ogv"
        };

        public String Thumbnail { get;  set; }
        public String Preview { get;  set; }
        public String Original { get;  set; }
        public UInt64 FileSize { get;  set; }

        public String Extension => Path.GetExtension(this.Original);

        public Boolean IsVideo => Array.IndexOf(VideoExtensions, this.Extension) > 0;

        public FilesDto(String thumbnail, String preview, String original, UInt64 fileSize)
        {
            this.Thumbnail = thumbnail;
            this.Preview = preview;
            this.Original = original;
            this.FileSize = fileSize;
        }
    }
}
