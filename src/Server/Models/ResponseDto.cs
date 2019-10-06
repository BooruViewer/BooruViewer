using System;
using System.Runtime.CompilerServices;

namespace BooruViewer.Models
{
    public class ResponseDto<T>
    {
        public Boolean IsSuccess { get;  }
        public T Data { get;  }
        public T Error { get;  }

        public ResponseDto(Boolean isSuccess, T obj)
        {
            this.IsSuccess = isSuccess;
            if (isSuccess)
                this.Data = obj;
            else this.Error = obj;

        }
    }
}
