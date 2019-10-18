using System;

namespace BooruViewer.Models
{
    public class ResponseErrorMessage : ResponseDto<String>
    {
        public String Message { get; }

        public ResponseErrorMessage(String message) : base(false, message)
        {
            this.Message = message;
        }
    }
}
