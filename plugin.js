/**!
 * VueJS Azure blob upload service
 * @author Andrzej Ojczenasz - email: codelaborer@gmail.com
 * @version 0.0.1
 * based on:
 * AngularJS Azure blob upload service with http post and progress.
 * by  Stephen Brannan - twitter: @kinstephen
 */

var azureBlob = function ($log, $http) {

    var DefaultBlockSize = 1024 * 32 // Default to 32KB

    /* config: {
      baseUrl: // baseUrl for blob file uri (i.e. http://<accountName>.blob.core.windows.net/<container>/<blobname>),
      sasToken: // Shared access signature querystring key/value prefixed with ?,
      file: // File object using the HTML5 File API,
      progress: // progress callback function,
      complete: // complete callback function,
      error: // error callback function,
      blockSize: // Use this to override the DefaultBlockSize
    } */
    var upload = function (config, httpClient) {
      var state = initializeState(config);

      // custom Http client
      if (httpClient) {
        $http = httpClient;
        $log('custom http client enabled!');
      }

      var reader = new FileReader();
      reader.onloadend = function (evt) {
        if (evt.target.readyState == FileReader.DONE && !state.cancelled) { // DONE == 2
          var uri = state.fileUrl + '&comp=block&blockid=' + state.blockIds[state.blockIds.length - 1];
          var requestData = new Uint8Array(evt.target.result);

          $log(uri);
          $http.put(uri, requestData,
            {
              headers: {
                'x-ms-blob-type': 'BlockBlob',
                'Content-Type': state.file.type,
              },
              transformRequest: [],
            }).then(function (response) {
            $log(response.data);
            $log(response.status);
            state.bytesUploaded += requestData.length;

            var percentComplete = ((parseFloat(state.bytesUploaded) / parseFloat(state.file.size)) * 100).toFixed(2);
            if (state.progress) state.progress(percentComplete, response.data, response.status, response.headers, response.config);

            uploadFileInBlocks(reader, state);
          }, function (response) {
            $log(response.data);
            $log(response.status);

            if (state.error) state.error(response.data, response.status, response.headers, response.config);
          });
        }
      };

      uploadFileInBlocks(reader, state);

      return {
        cancel: function () {
          state.cancelled = true;
        }
      };
    };

    var initializeState = function (config) {
      var blockSize = DefaultBlockSize;
      if (config.blockSize) blockSize = config.blockSize;

      var maxBlockSize = blockSize; // Default Block Size
      var numberOfBlocks = 1;

      var file = config.file;

      var fileSize = file.size;
      if (fileSize < blockSize) {
        maxBlockSize = fileSize;
        $log("max block size = " + maxBlockSize);
      }

      if (fileSize % maxBlockSize == 0) {
        numberOfBlocks = fileSize / maxBlockSize;
      } else {
        numberOfBlocks = parseInt(fileSize / maxBlockSize, 10) + 1;
      }

      $log("total blocks = " + numberOfBlocks);

      return {
        maxBlockSize: maxBlockSize, //Each file will be split in 256 KB.
        numberOfBlocks: numberOfBlocks,
        totalBytesRemaining: fileSize,
        currentFilePointer: 0,
        blockIds: new Array(),
        blockIdPrefix: 'block-',
        bytesUploaded: 0,
        submitUri: null,
        file: file,
        baseUrl: config.baseUrl,
        sasToken: config.sasToken,
        fileUrl: config.baseUrl + config.sasToken,
        progress: config.progress,
        complete: config.complete,
        error: config.error,
        cancelled: false
      };
    };

    var uploadFileInBlocks = function (reader, state) {
      if (!state.cancelled) {
        if (state.totalBytesRemaining > 0) {
          $log("current file pointer = " + state.currentFilePointer + " bytes read = " + state.maxBlockSize);

          var fileContent = state.file.slice(state.currentFilePointer, state.currentFilePointer + state.maxBlockSize);
          var blockId = state.blockIdPrefix + pad(state.blockIds.length, 6);
          $log("block id = " + blockId);

          state.blockIds.push(btoa(blockId));
          reader.readAsArrayBuffer(fileContent);

          state.currentFilePointer += state.maxBlockSize;
          state.totalBytesRemaining -= state.maxBlockSize;
          if (state.totalBytesRemaining < state.maxBlockSize) {
            state.maxBlockSize = state.totalBytesRemaining;
          }
        } else {
          commitBlockList(state);
        }
      }
    };

    var commitBlockList = function (state) {
      var uri = state.fileUrl + '&comp=blocklist';
      $log(uri);

      var requestBody = '<?xml version="1.0" encoding="utf-8"?><BlockList>';
      for (var i = 0; i < state.blockIds.length; i++) {
        requestBody += '<Latest>' + state.blockIds[i] + '</Latest>';
      }
      requestBody += '</BlockList>';
      $log(requestBody);

      $http.put(uri, requestBody,
        {
          headers: {
            'x-ms-blob-content-type': state.file.type,
          }
        }).then(function (response) {
        $log(response.data);
        $log(response.status);
        if (state.complete) state.complete(response.data, response.status, response.headers, response.config);
      }, function (response) {
        $log(response.data);
        $log(response.status);
        if (state.error) state.error(response.data, response.status, response.headers, response.config);
      });
    };

    var pad = function (number, length) {
      var str = '' + number;
      while (str.length < length) {
        str = '0' + str;
      }
      return str;
    };

    return upload;
}

azureBlob.install = function (Vue, options) {
  Vue.prototype.$log = console.log.bind(console);
  // Vue instance method declaration
  Vue.prototype.$azureUpload = this.call('upload', Vue.prototype.$log, Vue.$http);
}

export default azureBlob;
