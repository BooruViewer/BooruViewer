using System;

namespace BooruViewer.Models.Response.Posts
{
    public class SourceDto
    {
        public String FriendlyName { get;  set; }
        public String Href { get;  set; }

        public SourceDto(String friendlyName, String href)
        {
            this.FriendlyName = friendlyName;
            this.Href = href;
        }
    }
}
