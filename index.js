const MicroMQ = require("micromq");
const Jimp = require("jimp");
const imagemin = require("imagemin");
const imageminWebp = require("imagemin-webp");

// const ERROR_NOT_SUPPORTED = 'Whoops! File extension not supported!' // TODO
const SIZES = {
  "1920": "x-large",
  "1280": "large",
  "768": "medium",
  "540": "small",
  "50": "thumb"
};
const ORIGINAL_NAME = "original";

const convertToWebp = async (img, destination, imgName, extension) => {
  await imagemin([`${destination}/${imgName}.${extension}`], {
    destination,
    plugins: [ imageminWebp({quality: 80}) ]
  });
};

const resizeAndConvertSingleImage = async (img, destination, width, extension) => {
  const imageClone = img.clone();
  const imgName = SIZES[width];
  // resize and save
  
  await imageClone
    .resize(width, Jimp.AUTO)
    .quality(80)
    .writeAsync(`${destination}/${imgName}.${extension}`);

  // convert to webp
  await convertToWebp(img, destination, imgName, extension);
};

const resize = async (filePath, destination, extension) => {
  const img = await Jimp.read(filePath);
  let files = [];
  Object.keys(SIZES).forEach(key => {
    try {
      files.push(resizeAndConvertSingleImage(img, destination, Number.parseInt(key), extension));
    } catch (e) {
      throw new Error(e);
    }
  });
  await Promise.all(files);
};

console.log(process.env.MESSAGE_QUEUE);
const app = new MicroMQ({
  name: "convert",
  rabbit: {
    url: process.env.MESSAGE_QUEUE
  },
});

app.post("/convert", async (req, res) => {
  const {path, extension} = req.body.file;
  const destination = req.body.file.destination;
  const resizePromise = resize(path, destination, extension);
  resizePromise.then(() => {
    console.log("Images were successfully saved!");
  });
  
  // TODO: simplify
  res.json({
    ok: true,
    status: 200,
    data: {
      originalSrc: `${destination}/${ORIGINAL_NAME}.${extension}`,
      thumb: `${destination}/thumb.${extension}`,
      default: {
        540: `${destination}/${SIZES[540]}.${extension}`,
        768: `${destination}/${SIZES[768]}.${extension}`,
        1280: `${destination}/${SIZES[1280]}.${extension}`,
        1920: `${destination}/${SIZES[1920]}.${extension}`
      },
      webp: {
        540: `${destination}/${SIZES[540]}.webp`,
        768: `${destination}/${SIZES[768]}.webp`,
        1280: `${destination}/${SIZES[1280]}.webp`,
        1920: `${destination}/${SIZES[1920]}.webp`
      }
    }
  });
});

app.start();
