# Streams

### Writable Stream

Great for sending a lot of data in chunks, instead of sending all at once. This helps to avoid high memory usage.
e.g: Sending data to another service, or doing many writes to a file.

### Readable Stream

Allows your application to not run in memory issues, because instead read all the whole data at once to process it, you can read a chunk, proccess it, and continue reading until the end of the file, preventing high memory usage.


## Using these codes

1. Run writeStream.js to generate the src.txt file: `node writeStream.js`
2. Run readStream.js to read the src.txt file and generate the dest.txt file: `node readStream.js`