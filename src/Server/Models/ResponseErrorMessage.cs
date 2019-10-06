using System;

namespace BooruViewer.Models
{
    public class ResponseErrorMessage
    {
        public String Message { get; }

        public ResponseErrorMessage(String message)
        {
            this.Message = message;
        }
    }
}
