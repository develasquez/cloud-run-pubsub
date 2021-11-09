const Buffer = require('safe-buffer').Buffer;
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
    const data = pubSubMessage.data
      ? Buffer.from(pubSubMessage.data, 'base64').toString().trim()
      : ''; 
    console.log(data);
    res.status(204).send();
  });

  const PORT = process.env.PORT || 8080;

  app.listen(PORT, () =>
    console.log(`nodejs-pubsub-tutorial listening on port ${PORT}`)
  );
  

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

