using System;

namespace BooruViewer.Models.Response.Posts
{
    public class UploaderDto
    {
        public String FriendlyName { get; set;  }
        public String Href { get;  set; }

        public UploaderDto(String friendlyName, String href)
        {
            this.FriendlyName = friendlyName;
            this.Href = href;
        }
    }
}
