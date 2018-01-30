# Vue Azure Multipart Upload

VueJS service for uploading to azure blob storage.

based on https://github.com/kinstephen/angular-azure-blob-upload

Provides for the ability to upload an HTML5 File to Azure's Blob Storage. The file is uploaded in chunks to avoid memory issues as a BlockBlob. The upload uses a Shared Access Signature (SAS) to secure the file upload.

Required dependencies
-----------------------
* [VueJS](http://www.vuejs.com) 
* one of HTTP clients:
   - [Axios](https://github.com/axios/axios)
   - [Vue Axios](https://github.com/imcvampire/vue-axios)
   - [Vue Resource](https://github.com/pagekit/vue-resource)
   
 Installation
 -----------------------

```bash
npm i --save vue-azure-blob-upload
```

After instaling by `npm` (above) to your VueJS project

import `VueAzureUploader` to your main Vue file like so
```javascript
import VueAzureUploader from 'vue-azure-blob-upload'
Vue.use(VueAzureUploader);
````

How to use
-------------

Proper config will expose the following method in components

`this.$azureUpload.upload(config)`

The config object has the following properties

```javascript
{
  baseUrl: // baseUrl for blob file uri (i.e. http://<accountName>.blob.core.windows.net/<container>/<blobname>),
  sasToken: // Shared access signature querystring key/value prefixed with ?,
  file: // File object using the HTML5 File API,
  progress: // progress callback function,
  complete: // complete callback function,
  error: // error callback function,
  blockSize: // Use this to override the DefaultBlockSize,
}
```

How to use with custom http instance
-------------
`VueAzureUploader` is using `Vue.$http` object by default. You can provide custom instance of `Axios` or other promise-based `http` client.

```js
import Axios from 'axios'

const httpConfig = {
  headers: {
    authorizaion: 'Bearer token123'
  }
}

const axios = Axios.create(httpConfig)

this.$azureUpload.upload(config, axios)

```

CORS
-------------

Cross Origin Resource Sharing (CORS) must be enabled on the azure blob storage account. The following articles can assist with this...

[Windows Azure Storage Introducing CORS](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/02/03/windows-azure-storage-introducing-cors.aspx)

[Windows Azure Storage and CORS](http://www.contentmaster.com/azure/windows-azure-storage-cors/)


Special Thanks 
-------------
Thanks to Stephen Brannan and his original work using AngularJS. Most of it coming from original Angular JS version
https://github.com/kinstephen/angular-azure-blob-upload

Original thanks (from Angular version):
-------------
Extreme thanks goes to Gaurav Mantri and his original work using plain JavaScript. Much of it comes from the blob post...
(http://gauravmantri.com/2013/02/16/uploading-large-files-in-windows-azure-blob-storage-using-shared-access-signature-html-and-javascript). I took his original code from here and turned it into a re-usable Vue service.
