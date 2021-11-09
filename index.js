const Buffer = require('safe-buffer').Buffer;
const { Storage } = require("@google-cloud/storage");
const storage = new Storage();
const express = require('express');
const app = express();
app.use(express.json());

app.post('/', (req, res) => {
    if (!req.body) {
        const msg = 'no Pub/Sub message received';
        console.error(`error: ${msg}`);
        res.status(400).send(`Bad Request: ${msg}`);
        return;
    }
    if (!req.body.message) {
        const msg = 'invalid Pub/Sub message format';
        console.error(`error: ${msg}`);
        res.status(400).send(`Bad Request: ${msg}`);
        return;
    }

    const pubSubMessage = req.body.message;
    const data = JSON.parse(pubSubMessage.data
        ? Buffer.from(pubSubMessage.data, 'base64').toString().trim()
        : '{}');
    console.log(data);

    readFile(data.bucket, data.name);
    res.status(204).send();
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () =>
    console.log(`nodejs-pubsub-tutorial listening on port ${PORT}`)
);


readFile = (bucket, name) => {
    console.log('Reading File');
    var archivo = storage.bucket(bucket).file(name).createReadStream();
    console.log('Concat Data');
    var buf = '';
    archivo.on('data', function (d) {
        buf += d;
    }).on('end', function () {
        console.log(buf);
        console.log("End");
    });
};

/*
//const { PubSub } = require(`@google-cloud/pubsub`);
//const DESTINATION_TOPIC = `projects/${process.env.PROJECT_ID}/topics/${process.env.DESTINATION_TOPIC}`;
//const DLP = require('@google-cloud/dlp');
//const dlp = new DLP.DlpServiceClient();

async function deidentifyWithFpe(data) {
    try {
        const req = {
            "item": {
                "value": data
            },
            "parent": `projects/${process.env.PROJECT_ID}/locations/global`,
            "deidentifyConfig": {
                "infoTypeTransformations": {
                    "transformations": [
                        {
                            "infoTypes": [
                                {
                                    "name": "EMAIL_ADDRESS"
                                }
                            ],
                            "primitiveTransformation": {
                                "cryptoDeterministicConfig": {
                                    "cryptoKey": {
                                        "kmsWrapped": {
                                            "cryptoKeyName": process.env.KEYNAME,
                                            "wrappedKey": process.env.WRAPPEDKEY
                                        }
                                    },
                                    "surrogateInfoType": {
                                        "name": "EMAIL_ADDRESS_TOKEN"
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            "inspectConfig": {
                "infoTypes": [
                    {
                        "name": "EMAIL_ADDRESS"
                    }
                ]
            }
        };
        const [response] = await dlp.deidentifyContent(req);
        console.log(response.item.value);
        return JSON.parse(response.item.value);
    } catch (ex) {
        console.log(ex)
    }
}
*/

