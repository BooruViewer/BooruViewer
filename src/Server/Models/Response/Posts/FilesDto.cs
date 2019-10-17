using System;
using System.IO;

namespace BooruViewer.Models.Response.Posts
{
    public class FilesDto
    {
        private static String[] VideoExtensions =
        {
            ".mp4", ".webm", ".avi", ".wmv", ".mpg"
        };

        private static String[] WebVideoExtensions =
        {
            ".mp4", ".webm",
        };

        private static String[] FlashExtensions =
        {
            ".swf",
        };

        private static String[] UgoiraExtensions =
        {
            ".zip",
        };

        public String Thumbnail { get;  set; }
        public String Preview { get;  set; }
        public String Original { get;  set; }
        public UInt64 FileSize { get;  set; }

        public String Extension => Path.GetExtension(this.Original);

        public Boolean IsVideo => Array.IndexOf(VideoExtensions, this.Extension)!= -1;
        public Boolean IsWebVideo => Array.IndexOf(WebVideoExtensions, this.Extension)!= -1;
        public Boolean IsFlash => Array.IndexOf(FlashExtensions, this.Extension)!= -1;
        public Boolean IsUgoira => Array.IndexOf(UgoiraExtensions, this.Extension)!= -1;

        public FilesDto(String thumbnail, String preview, String original, UInt64 fileSize)
        {
            this.Thumbnail = thumbnail;
            this.Preview = preview;
            this.Original = original;
            this.FileSize = fileSize;
        }
    }
}
