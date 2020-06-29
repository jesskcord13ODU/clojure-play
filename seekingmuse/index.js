


const { ApolloServer } = require('apollo-server');
const MongoClient = require('mongodb').MongoClient;


let mongoURI = "mongodb://root:mysql@localhost:27017/muse?authSource=admin"
//
// This will decluster the db from the mongURI parameter in the process.env
// const { mongoURI: db } = process.env
console.log("db", mongoURI)


const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
let db = null
client.connect(function (err) {
    console.log("MONGOdb connected");
    db = client.db("muse"); //mongodb database name
});

const typeDefs = require('./schema');




const sampleData =
{
    "missionId": "JCAS",
    "scenario": [
        {
            "category": "Environment",
            "specEntries": [
                {
                    "iconImage": "weather.png",
                    "title": "Weather",
                    "description": "Lorem ipsum ad infinitum",
                    "bodyImage": "weatherMap.jpg",
                    "color": "red"
                },
                {
                    "iconImage": "terrain.png",
                    "title": "Terrain",
                    "description": "Lorem ipsum ad infinitum",
                    "bodyImage": "ambushMap.png",
                    "color": "green"
                },
                {
                    "iconImage": "weather.png",
                    "title": "Lorem Ipsum3",
                    "description": "Lorem ipsum ad infinitum",
                    "bodyImage": "weatherMap.jpg",
                    "color": "blue"
                }
            ]
        },
        {
            "category": "Forces",
            "specEntries": [
                {
                    "iconImage": "error.png",
                    "title": "Possible Enemy Armaments",
                    "description": "MP5, AK-47, SCAR, RPG, Vector",
                    "bodyImage": "arms.jpg",
                    "color": "red"
                },
                {
                    "iconImage": "knowledgeBase.png",
                    "title": "Intel Analysis",
                    "description": "Still waiting on final results",
                    "bodyImage": "analysis.jpg",
                    "color": "green"
                },
                {
                    "iconImage": "key.png",
                    "title": "Auth Chain",
                    "description": "Command chain to be deteremined soon",
                    "bodyImage": "faces/Desert.png",
                    "color": "purple"
                }
            ]
        },
        {
            "category": "Operations",
            "specEntries": [
                {
                    "iconImage": "upload.png",
                    "title": "Prepartion",
                    "description": "This mission requires these steps to prepare",
                    "bodyImage": "faces/Woman.png",
                    "color": "blue"
                },
                {
                    "iconImage": "download.png",
                    "title": "Deployment",
                    "description": "These units will be deployed here",
                    "bodyImage": "faces/Tank.png",
                    "color": "purple"
                }
            ]
        },
        {
            "category": "Components",
            "specEntries": [
                {
                    "iconImage": "gear.png",
                    "title": "Units",
                    "description": "Combat Ready Units",
                    "bodyImage": "faces/MilitaryGuy.png",
                    "color": "orange"
                }
            ]
        }
    ],
    "threads": [
        {
            "task number": 1,
            "task": "Scout detects hostile unit",
            "subjectUnit": "Plt member",
            "qualifier": "",
            "metric": "< 2 min"
        },
        {
            "task number": 2,
            "task": "Scout Notifies tactical unit commander",
            "subjectUnit": "plt member",
            "qualifier": "",
            "metric": " < 1 min"
        },
        {
            "task number": 3,
            "task": "Tactical unit commander passes",
            "subjectUnit": "Plt member",
            "qualifier": "",
            "metric": ""
        }
    ],
    "personnel": [
        {
            "name" : "George Clinton" ,
        },
        {
            "name" : "Tom Shultz" ,
        },
        {
            "name" : "Jimmy Page" ,
        },
        {
            "name" : "Jon Bonham" ,
        }
    ]
}

let resolvers = {
    Query: {
        hello: () => { return "Hello james" },
        getMissions: async () => {

            let ary = []

            let Specs = db.collection('specs')
            let cursor = await Specs.find({}).forEach(item => {
                console.log("-1-->", item)
                ary.push(item)
            })
            console.log("-2->", ary)
            return ary
        },
        getScenarioCategories: async () => {
            
            let Specs = db.collection('specs')
            let mission = await Specs.findOne({ missionId: 'JCAS' })

            console.log("-1-->", mission)

            ret = []
            mission.scenario.map(cat => {
                console.log("---3--->", cat)
                ret.push(cat)
            })
            return ret
        },
        getThreads: async () => {
            
            let retS = {}

            let Specs = db.collection('specs')
            let mission = await Specs.findOne({ missionId: 'JCAS' })

            console.log("-1-->", mission)

            ret = []
            mission.threads.map(thread => {
                console.log("---3--->", thread)
                ret.push(thread)
            })
            return ret
        },
        getPersonnel: async () => {
            let Specs = db.collection('specs')
            let mission = await Specs.findOne({ missionId: 'JCAS' })

            console.log("-1-->", mission)

            ret = []
            mission.personnel.map(person => {
                console.log("---3--->", person)
                ret.push(person)
            })
            return ret
        }
    },
    Mutation: {
        setupTest: (root, args, context, info) => {

            let Specs = db.collection('specs')
            let ret = Specs.insertOne(sampleData)
            return ret
        }
    }




}




const server = new ApolloServer({
    typeDefs,
    resolvers

    // dataSource: () => {
    //     marketAPI: new MarketAPI()
    // }

});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});