const fs = require('fs');
const Crawler = require("crawler");

const xmlConfig = async (textBlock) => {
  let text = textBlock;
  text = await text.replace(/\&/g, '&amp;');
  text = await text.replace(/\</g, '');
  text = await text.replace(/\>/g, '');
  text = await text.replace(/\'/g, '');
  text = await text.replace(/\"/g, '');
  return text;
}

let endingRoot = function () {
  return fs.createWriteStream('./saved.xml', { flags: 'a' }).write('</users>');
}

fs.createWriteStream('./saved.xml', { flags: 'a' }).write('<?xml version="1.0" encoding="UTF-8"?><users>');

const c = new Crawler({
  maxConnections: 10,
  jQuery: {
    name: 'cheerio',
    options: {
      normalizeWhitespace: true,
      xmlMode: true
    }
  },
  // This will be called for each crawled page
  callback: async function (error, res, done) {
    if (error) {
      console.log(error);
    } else {
      var $ = res.$;
      let con = "<researcher>";

      //researcher name
      let name = await ($('div#content > h1').text());
      name = await xmlConfig(name)
      con += "<researcher_name_variant>" + name + "</researcher_name_variant>";


      // position/title
      let posit = await ($('div#title').text());
      posit = await xmlConfig(posit)
      con += "<position>" + posit + "</position>";

      // department
      let depart = await ($('div#depts').text());
      depart = await depart.replace(/Departments\/Programs/g, "");
      depart = await xmlConfig(depart);
      con += "<researcher_organization_affiliation>" + depart + "</researcher_organization_affiliation>";

      // degrees/education
      let deg = await ($('div#degrees').text());
      deg = await xmlConfig(deg);
      deg = await deg.replace("Degrees", "");
      con += "<researcher_education>" + deg + "</researcher_education>";

      // expertise/keywords
      let exp = await ($('div#expertise').text());
      exp = await xmlConfig(exp);
      exp = await exp.replace("Expertise", "");
      con += "<researcher_keywords>" + exp + "</researcher_keywords>";

      // profile/description
      let desc = await ($('div#profile').text());
      desc = await xmlConfig(desc);
      con += "<researcher_description>" + desc + "</researcher_description>";

      // courses
      let cour = await ($('div#courses').text())
      cour = await xmlConfig(cour);
      cour = await cour.replace("Courses Taught", "");
      con += "<courses>" + cour + "</courses>";

      // awards/honors
      let hon = await ($('div#awards').text())
      hon = await xmlConfig(hon);
      con += "<researcher_honors>" + hon + "</researcher_honors>";

      // scholarship
      let schol = await ($('div#scholarship').text())
      schol = await xmlConfig(schol);
      schol = await schol.replace('Scholarship', '');
      con += "<scholarship>" + schol + "</scholarship>";

      // contact info
      let cont = ($('div#contact').text());
      cont = await xmlConfig(cont);
      con += "<contact>" + cont + "</contact>";

      // email
      let email = ($('div#contact > a').text());
      con += "<researcher_alternate_email>" + email + "</researcher_alternate_email>";

      // primary identifiier
      let email0 = email.split("@")[0];
      let email1 = email.split("@")[1];
      console.log(email0, email1);
      if (email1 !== "brandeis.edu") {
        con += "<Brandeis_primary_identifier>" + "" + "</Brandeis_primary_identifier>";
      } else {
        con += "<Brandeis_primary_identifier>" + email0 + "</Brandeis_primary_identifier>";
      }

      con += "</researcher>";
      // $ is Cheerio by default
      //a lean implementation of core jQuery designed specifically for the server
      fs.createWriteStream('./saved.xml', { flags: 'a' }).write(con);
    }
    done();
  },

});

setTimeout(function () { endingRoot(); }, 15000);


c.queue(
  [// A
    'https://www.brandeis.edu/facultyguide/person.html?emplid=ee995cbbd5fff5456e58b19f306d13fe88f30667',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=ad14637df2960bdc318d04f6f012b7f6ff002708',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=492b54d2516a631bbb95fe3cd9c3ba07a2b16958',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=7d503d4508c66f17bc4cd82a27f73288b788417b',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=ea7626a141dae075fc17cc3b9bdf20ce95d7d8fa',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=10db861bee810e9acadc1763d66bcf4939689123',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=2ff4bc1096fde4d54ce6b5bb8f327adc3cf7f704',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=eabe1d058500ad467e32edc0daf03f853957b894',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=53fbf19a3bc0b6c1c1715ec388c98f4ce3f61370',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=18d17425a26cc704cefa0293ec0ea527de872c0c',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=ed733741354464ab9a564ae9f8b6d3d8918fc1e6',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=6c7f3151d4540acb082a78a7acee3f58bd95f4aa',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=e04332e290a07c0a1591f69556e495c693039db0',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=ce4a47063949a48b985b7bf5d5d16fb47ae28fec',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=4a09ce0d1a4b429db8f07e9e0210e5e2e7ab094b',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=cf63e5b429988290b1667469d90e9f9ae4eefe8a',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=2b3cfa7bb20bf61744a9440b33739210acdf21d0',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=fb1fddebd87a1f990aff0837d9329ce64beb2fb8',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=d943317505769603b16546be88f11b0f815eeccc',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=770336c65c1029c53a4f90a05bce03872fc8033a',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=a3e7423ebd9c446a376ae1d164465083b86f8b48',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=fc9ae67b4cd6f69210cf06bc12a8f0dafe58240a',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=fc56544b69efaabfcd4670aa98b610b64812053f',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=b50d8e86cf884cbbdb0de8a3ad6c0c71fe8e660b',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=9cc8be37711904c358270b5d16df9833bc2f899c',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=987108318a8dad5265959a9c9452bb2e0221b1bc',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=c7cac72bf8ca34f6a5c15c7004e9155e9025eed3',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=f4184031dacfd7003dadc0f798d8f3d9498c1927',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=ae817ce31bcaa3db090dfd2f3e9c73d65a77807f',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=b580f8956745842919cc8157532f257db565a036',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=2f44d23a2ce78329ed61b45925525e063491d10d',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=93f876a917aa0b1f8acf3dd90329da7dfd54542b',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=d70e89b66fdc15103e65c1bb807f41debeffe9e5',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=4d0a125256afd15e484fd8bf9819d86090d0a846',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=086c84715b83dd7c1f4f7a80f4e2ca092020a1b8',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=903fb3e33266735c283df0f2959bad2cd3dc1a25',
    // B
    'https://www.brandeis.edu/facultyguide/person.html?emplid=0203b89f93c966048429830926729b410a600e79',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=42234b209a374038d9fd145daea3d4a1c0109241',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=3d36a78934b392379c10c51dfc802a17a7c08d86',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=e990b176bba6e9d42db05e977a74b4d66656c92e',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=2e812fa085f6794f8243bd7f89edd945c2a3f0fd',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=0cea0ade92ea1ea2bf70a330433accff3d7f660c',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=b9fd9015d1b4fabd427e72ca6004615ce6d13dfc',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=13773103dbc7bb876df2430825f3ad6296cb6e30',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=d3fc02490324f8d1f01ea0df1465244a5a7db773',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=e1e1c0ae2c1bb79db35ac36ddc4da15c3b8a7369',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=a62170a66e80ecc90959919e1abddda5edbeed42',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=3267d27a45c995efe7ebffb399cbfa534960c53b',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=b8c204f93f782722acf2f686a571f26e14577a06',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=7d79aa42016873b10915aeeb365c612ecdc85877',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=83aff42c4ab5658df68d7bf4f77f5f7bf54cd24e',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=fba116eb39977b03794340a6af5a4df4e0cabb54',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=2e2948199a471f332c598d7f52b237f265fb2ff6',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=e174d4e3b64898911f8483eec9c450688826c83a',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=37f602275504efd3dcd9800019d10d2472f65448',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=483b85abfb8ca29e3bc3b8021d054cfbebcb7d9f',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=9c2830d7ff572f26de72de740e9c3b9376bc0178',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=7d022f56c32923d7c5cfb61bc32c9b89302260ff',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=c6554c0ffccf653d91e1d6765a1dc0a8ffef15d9',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=bad8a7209427a5e5c2681c56c62d21f847d179fd',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=ec5a10fba8aba83d6e1e3cd8a6afc9176ca712db',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=0c4e127614c9151108f9631905ff804f2b270c13',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=7144e54665dfc535b17b720842aac44413cddeb6',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=618c696e80b167f775d26cef40323f5cb830910c',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=b3c1c98a151da4d54490ab7f57e656a1daac62ac',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=f0acd17b3b5dfcd89c99be7181856f4d38a0825c',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=6f863475e83e3a254cee874ac8a39838d69bee09',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=d5d87e4c7749faecf68a6592321a922450c36812',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=6f863475e83e3a254cee874ac8a39838d69bee09',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=723202f142646859f1a795db7f3f3c3bcd8e007b',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=ebeea16d3955403e8a2f21553eb4e26cf8b39179',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=bbe7a73def7bc55a1e674fe74f0cc432cbd892ed',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=dbd6403eb2b6a2e10ddb356489f7fbe47d0be500',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=f62c78536c9177dd69e4c388ed86dc500805c8aa',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=946bb41d3b9d504e0905fd093db63a31d36c5c8c',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=9103f8957f60d7860d561d06e13e4a167c1e8c0f',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=41b6d3f90690df9cbe0f3af9e766055fc9d8b494',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=6ef6cb20205b90bb9b90a5d4409243d81b532f58',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=1aac9360bde6035a990db5b07f3a33f1097a07ed',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=c419a9f9714f9742fc171484dbbc55394d8c2dd0',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=996bc8451bbc4a7668e0f8aa865b8eefc668eb83',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=65a616eb389f8e659cb135f5574c0b7b2a122513',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=d80db592860140ae6bdb25b057a91bcfeda73718',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=99ca745619b7c95028fd58d4cfc40b21d4f16bc4',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=1ea382383b3eafe98ed7fec4c23acf2f354e1c13',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=89d7d3696518a39e953d8262cbe21bd491f3fd6b',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=4b41717fe509b4c4d599292ee597d1bb14c58aee',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=f175dc007dbb5f286a330e804989c3483975ef91',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=43d4094d914f7dd5766f18faee19492809919956',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=8f38af7d88d171a8196c1750162aa761bc759646',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=68534fb3e21977cb2acab31fba0e92ef1548dcd4',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=3f4b119d06009d7d97cafe4d03fa05df0d52446b',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=a2a26a666400fbde3bf078b9d572fa111027ce61',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=fcaacc959e457a07e67069903ba95b02a96dc048',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=947183d5d9a73455f3dff7ebcf3bf398d9815bef',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=25cbca1d753dfccb524428ad96d2d7fd96488dee',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=bee470f707927903a57801e6507df1aad1cbdc9e',
    // C
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // '',
    // T
    'https://www.brandeis.edu/facultyguide/person.html?emplid=3af2eb6cf232a38efa61c024b3354886b29e2ff1',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=18743b595136186f88b165267e533e14a68989f8',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=32b1021e3a3498008ed0cea3c63ae353c21c56b7',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=73ceee2e40ad17b48cb9dbc908be48b2b899cc7e',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=2a244b26622c6d390481b75c2137bf57c35b2aea',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=f31f47d18b90fc41fc58d37af77c70bd6830033b',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=400754f80f043f8105797cf9a12728dc63dc13e1',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=9af29eda5b5ad4a84aaaaed64819195c7943a212',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=acfd5801b970fed682139edb66c698edf6b93c59',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=8d006743e8b3d36e4558ad704f231b88ca9971f4',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=66dd4f39111566eb17f3efb627f0b004295247bd',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=5c847ee22699acd80d315f76b94aab4657a39f5d',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=cfe445d95e0771a6ce5a0d6079fa30bd7cfd9b50',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=5596ecde6b1161c52ed4f84ed9089921c33f80df',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=84da22c0e2d2e6ef88d19b1ad63aea8218b4187d',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=6c3a0d8eb3d9c3c3f70a285e5ffe900ce317d3b8',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=ca1edf5e50fe063c6228883846e28da02493d465',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=62b9bce112998b31a368cad136c87c863e7f687b',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=33090fa5bb23a8d1fa5bb0fe11f1095f9414fb2b',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=a322c8e45d8f8df30d0f571614e760551b6df7e6',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=8cb81567ab262202223ac427c8e768ea4efad6b0',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=a1ca2d2c66cd14ade4ea407c9f4a42d11f2c12ae',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=90bf6f034a043ed8f4aa5b0d005b3b9936397953',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=4228390f4d49eacab0faf219ca30819ac6dbfda8',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=6681749606399eedaa0e9a159bbd1e426d071c11',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=49c61935a845342f0ac6bc7b87cf95c383e1e198',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=eb611a781249ab880a1205399fa4dd99e2905ac0',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=05d12bcb1995d3170bc0419382f116977ac718f8',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=895b1244161bf4d673968d6e78d68eaadca9a053',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=40d2f93a15af190491a5b0c8283e59da9ac6bdff',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=8c97511493a16f263d46a8b3d9f770bad94cc05c',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=0c8fc69cccc93419008f945d1337b5416544a091',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=5ab829e9560adc6ff7b9603d7a323b78cb3e8705',

    // U
    'https://www.brandeis.edu/facultyguide/person.html?emplid=9ea81c0b94ebc262f10d2065827733c2e903cafd',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=ebfc4626cb39711ab203d4e67e96051bd3437521',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=ce5b66df5ca0831702b2fbc133dcea32a907c60a',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=9517f8d576a93b98c690845b6d99effeb99152e8',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=af07bc7427e2467febd29d63e965818529208e4d',
    // V
    'https://www.brandeis.edu/facultyguide/person.html?emplid=ef83631eb007d59c4ab98afa1c4b55ee6db448d7',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=d5c2e687304823a83f3716a0fa0c4b459a805b92',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=8d17b50b827138abc069a6a6aff5d27c362f61dd',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=f3a003ca0b46a25cb8c43b051e9ff8cd39b62fca',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=83513d99e0f3d898a2894aa0b54a662aefaeaf95',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=1348a13fb768004c525dd36dd53d4ece1ce267b0',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=0103fc886fbf7dca0a0d07bf4f44d9f9c0e35891',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=f56b54fd8d2c840e61d834d1c163ab5584f280af',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=3a6b5caaeaf0eab9d6f86754b0af9472c9d43e39',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=3ebc76b493c9210b1686dc51509018b526796e9e',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=ca72d61991d68d4fbc4ff4de0010ae829006de26',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=61f3442b3edc778aead3e7b6e906f79140ad3c45',
    // W
    'https://www.brandeis.edu/facultyguide/person.html?emplid=225c51e0320830801e1bae2f4906244b7273e614',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=6fe4e671a89274274df2b8d17b57b7c41a337668',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=cb6ca33d2629f97273c932951825deb7b703bbf9',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=ef443f58dcbcefdd5cb3922b35ba0cd7972d94a6',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=ebb991c4509ca30716cc74190c3be6a20c1cf0eb',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=5ada60fb0415c75aa37507c48526953fbed9cd8f',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=5d98173cfcf039ca7204e42a1a9f613ba3fcc38c',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=ca2f1d522207a0e22c84dda2d11a54ec2a363b62',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=9298241ef67c9014b2cb63892ffa83e3be4d5735',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=56cebc62350154ecdb8def76373aa940a82f909c',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=aa8ee9d046d99190af3dcd05b4528097b98ebba9',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=1b24f2fd2134383c2cfcda9f3df6050ab7b1b210',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=e5ee7555669e12e36337f3eacd1587901a808eae',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=04df3111ce7eb4b4b267a316f5c0d51e281161ff',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=db9277ec709adf3abbcc089234fc1c35896e3b17',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=1567440f33f1955f1f0546b74f005ea2b61adbcf',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=2506dad80b906640a5f67eae5352cf7d5ad4288c',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=6e2ed7e628c80b6f108c69bf79ca7a1e543384bc',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=2de44a07053cd4e498768bb2df3024609866521f',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=9131f25dac5e130876c0744d40f6e3d411c4b95f',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=228da6ed4bb29523c1c267f1cd8b2f22fc6b1434',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=dc5299c52fdeedc867cf19500f2addb838e77b1a',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=75bc9c2ec86c38e50322aba8d0c9175ea621dbbf',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=3a4e754c180c146640b61803ce178355f88e6037',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=7f443ffde35747ba69faca210faff07145fab78c',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=76abcbd37e7907555d85a1ebf28b41cdfffc24f8',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=cc84b70a5162bebdce92f6c74462793e2470f99c',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=784961b9e131b6cf75008400eab085626ca00b1c',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=8d42503035ff7bae3314b1940f028b90d911e991',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=670b1c6e7552df669d4590b33e1fe61c4b84ba4f',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=27fd975cf6965f84a3331073645d23635e0985be',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=c2e7617272cd51021765d790881bb00bc6367796',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=6435bfa283efcc4c46798fe04c3ab0366836110f',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=83c0eefe281ae694e7d633b619da104c784e00f0',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=fd9381b4518d2087006764faa53a62d0a1ff73ba',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=abce00f450edd4f17670a17dfc240d8d3f2a7482',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=acb1c8ce623597a8e60a78409138f69ec87dc402',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=180d1004b3bca05a2bdb0c3a890df9a9ddc17fb6',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=a90338bd71f8b2c9ec8295b8f10ac3758474b621',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=eb92f56e5dbd799a18a39b8286ab89658b5b9ad1',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=4a4815cbee4b9f58f2dc902edf6febeb6fc3b53b',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=85ca6e626f7e54eb70fb030f075886e381e943df',
    // X
    'https://www.brandeis.edu/facultyguide/person.html?emplid=30a99020a2841efa9872954d095ef732c5cf0c6c',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=cef471255f6b34c2487a9213901de0cf38e21ed3',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=01a843913ddbf1c081b99a03f8be5a8af084d2bb',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=4168a39bf2c7548d050fe95a78ec2bdd4af7bb61',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=cc59be08d0a43aa426bd6098a41c0c1171822755',
    // Y
    'https://www.brandeis.edu/facultyguide/person.html?emplid=2d33bfcf3e8d075ca7e63e9a9775face67e35a9d',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=573a5c1248fd11850ea13d77fb1d06aeb2973a65',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=80857feb52f767e2d0abb8480c78144a7da86ce1',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=2243f95f5fb833eb312352899cf725da73865adc',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=a63a9db41ec1616c594bf0b6e5a1f562237ac099',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=ae26e71fa18c16c90b39655dc97cd38934bd2bea',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=4e52d66a63e58568c57a1a6b41f957eab4a2badb',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=81a61660b57a866eb0bef8b7f32ff56455d093b8',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=2688783b6e4d8ce4fd834ec425877fcd6d311413',
    // Z
    'https://www.brandeis.edu/facultyguide/person.html?emplid=4dd233275d124d9d0d17eda2d59c0b0e1c158b5e',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=2eb6be94b388be4b500e54ef726277fd747f02bb',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=13711ef6a2f7f3f6c90b4cb304386acf67981435',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=e2ba663083c6bb9545c30e6e7f0cb7dfbc76877b',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=49abfed67327a34205d32304429657b898bf8ac4',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=d4ff662472f596912026b496ad7508f4421504df',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=ce72f71003b9204d396c79bd3554d42ee43d3d7e',
    'https://www.brandeis.edu/facultyguide/person.html?emplid=3ca71572d81f0a16edc7a0cef6b3963bc00baaa5',
    //'',
  ]
);

