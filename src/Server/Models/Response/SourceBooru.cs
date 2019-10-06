using System;

namespace BooruViewer.Models.Response
{
    public class SourceBooru
    {
        public String Href { get; }
        public String Name { get; }
        public String FriendlyName { get; }

        public SourceBooru(String name, String friendlyName, String href)
        {
            this.Name = name;
            this.FriendlyName = friendlyName;
            this.Href = href;
        }
    }
}
