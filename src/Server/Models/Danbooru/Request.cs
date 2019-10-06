using System;

namespace BooruViewer.Models.Danbooru
{
    public class Request
    {
        public Boolean Success { get; set; } = true;
        public String Message { get; set; }
        public String[] Backtrace { get; set; }
    }
}
