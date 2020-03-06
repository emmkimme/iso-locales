# iso-languages
An IPC (Inter-Process Communication) bus for applications built on [Node](https://nodejs.org/en/) or [Electron](https://electronjs.org/). 

This bus offers a EventEmitter-like API for exchanging data between any processes (Node process/s, Electron Master, Electron Renderer process/s).
* Node to Node, 
* Node to Electron (Master and Renderer processes), 
* Electron to Node, 
* Electron to Electron.

For Node processes support, you need to instanciate a "BusBroker" (Net server) in charge to commute messages to right listeners  
For Electron Main/Renderer processes, you need an additional broker : "BusBridge" in charge to commute messages between renderers (WebPages), Master and Node.

You can have a pure Node bus, just using BusBroker (even working out of Electron)
You can have a Electron Main/Renderer processes bus, just using BusBridge 
You can have a dual-mode supporting all kind of processes by creating BusBroker/BusBridge.

A WebPage is then able to dialog with a node process and vice-versa.

# Features
* EventEmitter oriented API
* Works with Electron sandboxed renderer process
* Support for Electron renderer affinity (several webpages hosted in the same renderer process)
* Basic remote API calls/events and pending messages management with Services

# Installation
```Batchfile
npm install electron-common-ipc
```

Dependencies
* https://github.com/emmkimme/socket-serializer
* http://electron.atom.io/
* http://nodejs.org/


# Technical Overview

## Objective
![Electron's processes](https://raw.githubusercontent.com/emmkimme/electron-common-ipc/Doc_Update/doc/electron_processes.svg)


# Usage

## Scenarii
### Electron App
Pseuso code in...  
**Main Process**
- ipcBusBridge = IpcBusBridge.Create
- ipcBusBridge.connect
- ipcBusClientElectronMain = IpcBusClient.Create
- ipcBusClientElectronMain.connect

**Renderer Process (nodeIntegration = true)**
- ipcBusClientRenderer1 = IpcBusClient.Create
- ipcBusClientRenderer1.connect

**Sandboxed Renderer Process (sandbox = true)**
- load ipcbus library in the preload file
- ipcBusClientRenderer2 = IpcBusClient.Create
- ipcBusClientRenderer2.connect

done  
ipcBusClientElectronMain, ipcBusClientRenderer1 and ipcBusClientRenderer2 can exchange data.

### NodeJS App
Pseuso code in...  
**Main Process**
- find a free port (using [Socket port helpers](https://github.com/emmkimme/socket-port-helpers) for instance)
- ipcBusBroker = IpcBusBroker.Create
- ipcBusBroker.connect [free port]
- ipcBusClientNodeMain = IpcBusClient.Create
- ipcBusClientNodeMain.connect [free port]

**Child node process**
- retrieve free port through commandline or environment variable
- ipcBusClientNodeChild = IpcBusClient.Create
- ipcBusClientNodeChild.connect [free port]

done  
ipcBusClientNodeMain and ipcBusClientNodeChild can exchange data.

### Hybrid App (NodeJS and Electron)
Pseuso code in...  
**Main Process**
- ipBusBridge.connect [same port as the ipcBusBroker]

done  
ipcBusClientElectronMain, ipcBusClientRenderer1 and ipcBusClientRenderer2, ipcBusClientNodeMain and ipcBusClientNodeChild can exchange data.



```js
// Load modules
const ipcBusModule = require("electron-ipc-bus");
const electronApp = require('electron').app;

// Configuration
const ipcBusPath = 50494;
// const ipcBusPath = '/myfavorite/path';

// Startup
electronApp.on('ready', function () {
    // Create broker if you want to interact with NodeJS process
    const ipcBusBroker = ipcBusModule.IpcBusBroker.Create();
    // Start broker
    ipcBusBroker.connect(ipcBusPath)
        .then((msg) => {
            console.log('IpcBusBroker started');

            // Create bridge
            const ipcBusBridge = ipcBusModule.IpcBusBridge.Create();
            // Connect using a busPath if you want to interact with NodeJS process
            ipcBusBridge.connect(ipcBusPath)
                .then((msg) => {
                    console.log('IpcBusBridge started');

                    // Create clients
                    const ipcBusClient1 = ipcBusModule.IpcBusClient.Create();
                    const ipcBusClient2 = ipcBusModule.IpcBusClient.Create();
                    Promise.all([ipcBusClient1.connect({ peerName: 'client1' }), ipcBusClient2.connect({ peerName: 'client2' })])
                        .then((msg) => {
                            // Chatting on channel 'greeting'
                            ipcBusClient1.addListener('greeting', (ipcBusEvent, greetingMsg) => {
                                // This is a request, we have to reply immediatly using request.resolve or request.reject
                                if (ipcBusEvent.request) {
                                    ipcBusEvent.request.resolve(`thanks to you, dear #${ipcBusEvent.sender.name}`);
                                }
                                // Else we reply using a contractual channel
                                else {
                                    ipcBusClient1.send('greeting-reply', `${ipcBusClient1.peer.name}: thanks to all listeners`)
                                }
                                console.log(ipcBusClient1.peer.name + ' received ' + ipcBusEvent.channel + ': ' + greetingMsg);
                            });

                            ipcBusClient2.addListener('greeting', (ipcBusEvent, greetingMsg) => {
                                if (ipcBusEvent.request) {
                                    ipcBusEvent.request.resolve(`thanks to you, dear #${ipcBusEvent.sender.name}`);
                                }
                                else {
                                    ipcBusClient2.send('greeting-reply', `${ipcBusClient2.peer.name}: thanks to all listeners`)
                                }
                                console.log(ipcBusClient2.peer.name + ' received ' + ipcBusEvent.channel + ': ' + greetingMsg);
                            });

                            ipcBusClient1.addListener('greeting-reply', (ipcBusEvent, greetingReplyMsg) => {
                                console.log(greetingReplyMsg);
                                console.log(ipcBusClient1.peer.name + ' received ' + ipcBusEvent.channel + ': ' + greetingReplyMsg);
                            });

                            ipcBusClient2.send('greeting', 'hello everyone!');

                            // This call will fail, too short to answer on time !
                            ipcBusClient2.request('greeting', 0, 'hello partner, please answer immediatly')
                                .then((ipcBusRequestResponse) => {
                                    console.log(JSON.stringify(ipcBusRequestResponse.event.sender.name) + ' replied ' + ipcBusRequestResponse.payload);
                                })
                                .catch((err) => {
                                    console.log('Too late, I have no friend :-(');
                                });

                            ipcBusClient1.request('greeting', 1000, 'hello partner, please answer within 1sec!')
                                .then((ipcBusRequestResponse) => {
                                    console.log(JSON.stringify(ipcBusRequestResponse.event.sender.name) + ' replied within 1sec1 ' + ipcBusRequestResponse.payload);
                                })
                                .catch((err) => {
                                    console.log('I have no friend :-(');
                                });
                        });
                });
        });
});
```

# Breaking changes
6.x.x | 7.x.x
--- | ---
IpcBusBridge.Create(net-options) | IpcBusBridge.Create()
ipcBusBridge.connect(connect-options) | ipcBusBridge.connect(connect-options + net-options)
ipcBusBridge.stop(close-options) | ipcBusBridge.close(close-options)
IpcBusBroker.Create(net-options) | IpcBusBroker.Create()
IpcBusBroker.connect(connect-options) | IpcBusBroker.connect(connect-options + net-options)
IpcBusBroker.stop(close-options) | IpcBusBroker.close(close-options)
IpcBusClient.Create(net-options) | IpcBusClient.Create()
IpcBusClient.connect(connect-options) | IpcBusClient.connect(connect-options + net-options)
IpcBusClient.stop(close-options) | IpcBusClient.close(close-options)


# Initialization
If you are using the bus in a renderer process (page), you must take care of the context :
- sandbox
- nodeIntegration
- cross-frames [experimental]

In order to have bus working in all contexts you can register the bus in the preload file of your BrowserWindow

```ts
let win = new BrowserWindow({ webPreferences { preload: 'preload-ipc.bundle.js' } })
```

preload-ipc.js
```js
const electronCommonIpc = require('electron-common-ipc');
electronCommonIpc.PreloadElectronCommonIpc();
```

You have to bundle your file :
```BatchFile
browserify -o ./preload-ipc.bundle.js -x electron ./preload-ipc.js
```

Use Browserify >= 16.5.0 for having full support of EventEmitter.

***Bus in frame is still experimental.***

# Common options
Some interfaces are sharing the same kind of options.  
In order to be consistent in term of behavior and naming we have common interfaces for options.

```ts
export interface IpcTimeoutOptions {
    timeoutDelay?: number;
}
```
- ***timeoutDelay*** = number (milliseconds)

- **timeoutDelay** [0 | undefined | null] : use a default timeout of 2000ms
- **timeoutDelay** < 0 : an infinite waiting
- **timeoutDelay** > 0 : wait for the expected time

A timeoutdelay below zero leads to an infinite waiting.

```ts
export interface IpcSocketBufferingOptions {
    socketBuffer?: number;
} 
```
- **socketBuffer** [0 | undefined | null] : message is serialized in small pieces written immediatly to the socket
- **socketBuffer** < 0 : message is serialized in objects (number, string, buffer...), each object is written immediatly to the socket
- **socketBuffer** > 0 : message is serialized in objects, objects are written only in one shot when reaching a size of **socketBuffer** in bytes.

```ts
export interface IpcNetOptions {
    port?: number;
    host?: string;
    path?: string;
    useBridge?: boolean;
}
```
See [NodeJS Net](https://nodejs.org/api/net.html#net_socket_connect)
- **useBridge** : the client will use the BusBrige to discuss with the socket server (BusBroker). It is  more efficient to go to the bridge than connecting directly to the net server (BusBroker).

# IpcBusBroker
Dispatching of Node messages is managed by a broker. You can have only one single Broker for the whole application.  
The broker can be instanciated in a node process or in the master process (not in renderer processes).  
For performance purpose, it is better to instanciate the broker in an independent node process.

## Interface
```ts
interface IpcBusBroker {
    connect(options?: IpcBusBroker.StartOptions): Promise<string>;
    close(): void;
    queryState(): Object;
    isServiceAvailable(serviceName: string): boolean;
}
```
## Initialization of the Broker (in a node process)

```js
const ipcBusModule = require("electron-common-ipc");
const ipcBusBroker = ipcBusModule.IpcBusBroker.Create([busPath]);
```

The ***require()*** call loads the module and IpcBusBroker.Create setups the broker with the ***busPath***.


```js
// Socket path
const ipcBusBroker = ipcBusModule.IpcBusBroker.Create();
```

## Methods

### connect(options?: IpcBusBroker.StartOptions) : Promise < string >

```js
// Socket path
ipcBusBroker.connect('/my-ipc-bus-path') 
    .then(() => console.log('success'))
    .catch((err) => console.log(err))
```

```js
// Port number
ipcBusBroker.connect(58666) 
    .then(() => console.log('success'))
    .catch((err) => console.log(err))
```

Starts the broker dispatcher.
If failed (timeout or any other internal error), ***err*** contains the error message.

### close()

```js
ipcBusBroker.close() 
```

### queryState() - for debugging purpose only

```js
var queryState = ipcBusBroker.queryState() 
````

Returns the list of pair <channel, peer> subscriptions. Format may change from one version to another.
This information can be retrieved from an IpcBusClient through the channel : /electron-common-ipc/queryState

### isServiceAvailable(serviceName): boolean 
- ***serviceName***: string

```js
ipcBusBroker.isServiceAvailable('mySettings') 
```

Test if a service is started.
This information can be retrieved from an IpcBusClient through the channel : /electron-common-ipc/serviceAvailable


# IpcBusBridge
Dispatching of Renderer messages is managed by a bridge. You can have only one single bridge for the whole application.
The bridge must be instanciated in the master process only. Without this bridge, Renderer and Node processes are not able to dialog.

## Interface
```ts
interface IpcBusBridge {
    connect(options?: IpcBusBridge.StartOptions): Promise<string>;
    close(): void;
}
```
## Initialization of the Bridge (in the master process)

```js
const ipcBusModule = require("electron-common-ipc");
const ipcBusBridge = ipcBusModule.IpcBusBridge.Create();
```

## Methods

### connect(options?: IpcBusBridge.StartOptions) : Promise < string >

```js
// Socket path
ipcBusBridge.connect('/my-ipc-bus-path') 
    .then(() => console.log('success'))
    .catch((err) => console.log(err))
```

```js
// Port number
ipcBusBridge.connect(58666) 
    .then(() => console.log('success'))
    .catch((err) => console.log(err))
```

Starts the bridge dispatcher.
If failed (timeout or any other internal error), ***err*** contains the error message.

### close()

```js
ipcBusBridge.stop() 
```


# IpcBusClient
The ***IpcBusClient*** is an instance of the ***EventEmitter*** class.

When you register a callback to a specified channel. Each time a message is received on this channel, the callback is called.
The callback must follow the ***IpcBusListener*** signature (see below).

## Interface
```ts
interface IpcBusClient extends events.EventEmitter {
    readonly peerName: string;

    connect(options?: IpcBusClient.ConnectOptions): Promise<string>;
    close(): void;

    send(channel: string, ...args: any[]): void;
    request(channel: string, timeoutDelay: number, ...args: any[]): Promise<IpcBusRequestResponse>;

    // EventEmitter overriden API
    addListener(channel: string, listener: IpcBusListener): this;
    removeListener(channel: string, listener: IpcBusListener): this;
    on(channel: string, listener: IpcBusListener): this;
    once(channel: string, listener: IpcBusListener): this;
    off(channel: string, listener: IpcBusListener): this;

    // Added in Node 6...
    prependListener(channel: string, listener: IpcBusListener): this;
    prependOnceListener(channel: string, listener: IpcBusListener): this;
}
```

## Initialization in the Main/Browser Node process

```js
const ipcBusModule = require("electron-common-ipc");
const ipcBus = ipcBusModule.IpcBusClient.Create();
````

```js
ipcBus.connect([net options]);
```

IpcBusClient.connect setups the client with the ***busPath*** that was used to connect the broker.

## Initialization in a Node single process
 
```js
ipcBus.connect('/my-ipc-bus-path');
```

## Initialization in a Renderer process (either sandboxed or not)
if use ***sandbox*** you have to preload code like this:
```js
const electronCommonIpc = require('electron-common-ipc');
if (electronCommonIpc.PreloadElectronCommonIpc()) {
  electronCommonIpc.ActivateIpcBusTrace(true);
  window.ipcBus = window.ElectronCommonIpc.CreateIpcBusClient();
  window.ipcBus.IPCBUS_CHANNEL_QUERY_STATE = electronCommonIpc.IPCBUS_CHANNEL_QUERY_STATE;
}
```
if not, just type this code in your renderer process:
```js
if (electronCommonIpc.PreloadElectronCommonIpc()) {
    electronCommonIpc.ActivateIpcBusTrace(true);
    const ipcBus = window.ElectronCommonIpc.CreateIpcBusClient();
}
```
NOTE: There is no notion of port, buspath in a renderer. IpcBusRenderer connects automatically to the instance of the bridge.

## Property

### peer
For debugging purpose, each ***IpcBusClient*** is identified by a peer.
```js
type IpcBusProcessType = 'main' | 'renderer' | 'renderer-frame' | 'node';

interface IpcBusProcess {
    type: IpcBusProcessType;
    pid: number;
    rid?: number;
    wcid?: number;
}

interface IpcBusPeer {
    id: number;
    name: string;
    process: IpcBusProcess;
}
```
IpcBusPeer contains :
- an uniq read-only id
- the name of the peer, this name can be changed during the connection (IpcBusClient.connect)
- the process context of the peer.

IpcBusProcess contains :
 - type : type of the context : 'main' | 'renderer' | 'renderer-frame' | 'node'
 - pid : id of the process which hosts the the peer
 - rid : client id of the renderer process where the peer is hosted (equivalent to the value of --renderer-client-id option in the commandline of the renderer process), only valid for a 'renderer' process
 - wcid : webContents id of the peer, only valid for a 'renderer' process

For a 'renderer' process the pid depends on the version of Electron.

Electron < 1.7.1 : pid = wcid


## Connectivity Methods

### connect(options?: IpcBusClient.ConnectOptions) : Promise < string >

Basic usage
```js
ipcBus.connect().then((eventName) => console.log("Connected to Ipc bus !"))
```

Provide a timeout
```js
ipcBus.connect({ timeoutDelay: 2000 }).then((eventName) => console.log("Connected to Ipc bus !"))
```

Provide a peer name
```js
ipcBus.connect({ peerName: 'client2' }).then((eventName) => console.log("Connected to Ipc bus !"))
```

Provide all options
```js
ipcBus.connect({ peerName: 'client2', timeoutDelay: 2000 }).then((eventName) => console.log("Connected to Ipc bus !"))
```

For a bus in a renderer, it fails if the Bridge is not started else it fails if the Broker is not started.
Most of the functions below will fail if the connection is not established (you have to wait for the connect promise).
A timeoutdelay below zero leads to an infinite waiting.

### close()
```js
ipcBus.close()
```

### addListener(channel, listener)
- ***channel***: string
- ***listener***: IpcBusListener

Listens to ***channel***, when a new message arrives ***listener*** would be called with listener(event, args...).

NOTE: ***on***, ***prependListener***, ***once*** and ***prependOnceListener*** methods are supported as well

### removeListener(channel, listener)
- ***channel***: string
- ***listener***: IpcBusListener

Removes the specified ***listener*** from the listeners array for the specified ***channel***.

NOTE: ***off*** method is supported as well

### removeAllListeners([channel])
***channel***: String (optional)

Removes all listeners, or those of the specified ***channel***.

## IpcBusListener(event, ...args) callback
- ***event***: IpcBusEvent
- ***...args***: any[]): void

The first parameter of the callback is always an event which contains the channel and the origin of the message (sender).

```js
function HelloHandler(ipcBusEvent, content) {
    console.log("Received '" + content + "' on channel '" + ipcBusEvent.channel +"' from #" + ipcBusEvent.sender.peerName)
}
ipcBus.on("Hello!", HelloHandler)
```

## Posting Methods
### send(channel [, ...args])
- ***channel***: string
- ***...args***: any[]

Sends a message asynchronously via ***channel***, you can also send arbitrary arguments. 
Arguments will be serialized in JSON internally and hence no functions or prototype chain will be included.

```js
ipcBus.send("Hello!", { name: "My age !"}, "is", 10)
```

### request(channel: string, timeoutDelay: number, ...args: any[]): Promise<IpcBusRequestResponse>
- ***channel***: string
- ***timeoutDelay*** = timeoutDelay: number (milliseconds)
- ***...args***: any[]

Sends a request message on specified ***channel***. The returned Promise is settled when a result is available.
The parameter ***timeoutDelay*** defines how much time we're waiting for the response.
A timeoutdelay below zero leads to an infinite waiting.

The Promise provides an ***IpcBusRequestResponse*** object:
```ts
interface IpcBusRequestResponse {
    event: IpcBusEvent;
    payload?: Object | string;
    err?: string;
}
```

```js
ipcBus.request("compute", 0, "2*PI*9")
    .then(ipcBusRequestResponse) {
        console.log("channel = " + ipcBusRequestResponse.event.channel + ", response = " + ipcBusRequestResponse.payload + ", from = " + ipcBusRequestResponse.event.sender.peerName);
     }
     .catch(ipcBusRequestResponse) {
        console.log("err = " + ipcBusRequestResponse.err);
     }
```

With timeout
```js
ipcBus.request("compute", 2000, "2*PI*9")
...
```

## IpcBusEvent object
```ts
interface IpcBusEvent {
    channel: string;
    sender: IpcBusSender {
        peerName: string;
    };
    request?: IpcBusRequest {
        resolve(payload: Object | string): void;
        reject(err: string): void;
    };
}
```
The event object passed to the listener has the following properties:
### event.channel: string
***channel*** delivering the message

### event.sender.peerName: string
***peerName*** of the sender

### event.request [optional]: IpcBusRequest
If present, the message is a request.
Listener can resolve the request by calling ***event.request.resolve()*** with the response or can reject the request by calling ***event.request.reject()*** with an error message.


# IpcBusService
The ***IpcBusService*** creates an IPC endpoint that can be requested via remote calls and send events.

## Interface
```ts
interface IpcBusService {
    start(): void;
    stop(): void;
    registerCallHandler(name: string, handler: IpcBusServiceCallHandler): void;
    sendEvent(eventName: string, ...args: any[]): void;
}
```

## IpcBusServiceCall
Message sent to a service to execute a remote call.
```ts
interface IpcBusServiceCall {
    handlerName: string;
    args: any[];
}
```

## IpcBusServiceCallHandler
Prototype of a method that will be executed to handle a service's call.
```ts
interface IpcBusServiceCallHandler {
    (call: IpcBusServiceCall, request: IpcBusRequest): void;
}
```

## Creation (without an outer implementation)
```js
const ipcBusModule = require("electron-common-ipc");
...
// ipcBusClient is a connected instance of IpcBusClient
const ipcMyService = ipcBusModule.IpcBusService.Create(ipcBusClient, 'myService');
```

## Creation (with an outer instance)
```js
const ipcBusModule = require("electron-common-ipc");
...
const myOuterServiceInstance = {};
myOuterServiceInstance.test = () => { return 'This is a test'; };
...
// ipcBusClient is a connected instance of IpcBusClient
const ipcMyService = ipcBusModule.IpcBusService.Create(ipcBusClient, 'myService', myOuterServiceInstance);
```
NOTE : This constructor will automatically register all methods of ***myOuterServiceImpl*** as call handlers using ***registerCallHandler()***.

## Methods

### start(): void
This makes the service to listen and serve incoming remote calls.
The service also sends the ***IPCBUS_SERVICE_EVENT_START*** event.
NOTE : If an outerrouter service's instance has been specified at construction time, ***connect()*** will overload its This method will overload

### stop(): void
This makes the service to stop listen and serve incoming remote calls.
The service also sends the ***IPCBUS_SERVICE_EVENT_STOP*** event.

### registerCallHandler(name, handler): void
- ***name***: string
- ***handler***: IpcBusServiceCallHandler
This sets the function that will be executed to serve the specified remote call.
As this is run in the context of a promise, the function must call either request.resolve()
or request.reject() to fulfill the promise.
```js
ipcMyService.registerCallHandler('getCurrentTime', (event, call) => {
    if (event.request) {
            try {                        {
                request.resolve(new Date().getTime());
            } catch(e) {
                request.reject(e);
            }
        });
    }
```

### sendEvent(name, ...args): void
- ***name***: string
- ***args***: any[]
This sends a service event message.
```js
ipcMyService.sendEvent('timeChanged', new Date().getTime());
```


# IpcBusServiceProxy
The ***IpcBusServiceProxy*** creates an IPC endpoint that can be used to execute calls on a service and listen its events.

## Interface
```ts
interface IpcBusServiceProxy extends events.EventEmitter {
    readonly isStarted: boolean;

    getStatus(): Promise<ServiceStatus>;
    call<T>(handlerName: string, ...args: any[]): Promise<T>;
    getWrapper<T>(): T;
    connect<T>(timeoutDelay?: number): Promise<T>
```

## IpcBusServiceEvent
Message sent to a service's proxy to trigger the code associated to this event.
```ts
interface IpcBusServiceEvent {
    eventName: string;
    args: any[];
}
```

## IpcBusServiceEventHandler
Prototype of a method that will be executed to handle a service's call.
```ts
interface IpcBusServiceEventHandler {
    (event: IpcBusServiceEvent): void;
}
```

## Creation
```js
const ipcBusModule = require("electron-common-ipc");
...
// ipcBusClient is a connected instance of IpcBusClient
const ipcMyServiceProxy = ipcBusModule.IpcBusServiceProxy.Create(ipcBusClient, 'myService', 2000); // 2000 ms for call timeout (default is 1000 ms)
```

## Properties

### isAvailable: boolean
Availability of the associated service (available means that the service is started).

## Methods

### checkAvailability(): Promise< boolean >
This asynchronously requests the service availability to the Broker.
```js
ipcMyServiceProxy.checkAvailability()
        .then(
            (availability) => console.log(`MyService availability = ${availability}`),
            (err) => console.log(`Failed to get MyService availability (${err})`));
```

### call<T>(handlerName: string, timeout: number, ...args: any[]): Promise< T >
- ***handlerName***: string
- ***timeout***: number
- ***args***: any[]
This sends a service event message.
```js
ipcMyServiceProxy.call('getCurrentTime')
        .then(
            (currentTime) => console.log(`Current Time = ${currentTime}`),
            (err) => console.log(`Failed to get current time : ${err}`));
```

### EventEmitter interface ###
This allow to handle events emitted by remote RPC service. Please refers to the EventEmitter class documentation for more information.
- addListener(event: string, listener: IpcBusServiceEventHandler): this;
- removeListener(event: string, listener: IpcBusServiceEventHandler): this;
- on(event: string, listener: IpcBusServiceEventHandler): this;
- once(event: string, listener: IpcBusServiceEventHandler): this;
- off(event: string, listener: IpcBusServiceEventHandler): this;
- removeAllListeners(event?: string): this;
- prependListener(event: string, listener: IpcBusServiceEventHandler): this;
- prependOnceListener(event: string, listener: IpcBusServiceEventHandler): this;

The wrapper implements EventEmitter as well. If the interface of the service emits an event it will be receiced by the wrapper of the proxy.

# Test application
The test-app folder contains all sources of the testing application.

NOTE: This folder is not packaged by NPM.

To build the application:
```
cd examples
cd test-app
npm install
npm run build
```

To run the application:
```
npm run connect
```

To run the application in sandboxed mode:
```
npm run connect-sandboxed
```


# Possible enhancements
* Support several brokers each with its own buspath in order to distribute the traffic load.
* Add an optional spy for debugging purpose

# MIT License

Copyright (c) 2020 Emmanuel Kimmerlin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.