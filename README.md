<!--
author:   André Dietrich
email:    LiaScript@web.de
version:  0.1.1
language: en
narrator: US English Male

comment:  Animated DiceBear avatars as narrators: while LiaScript reads the
          comments aloud, by text-to-speech or from audio recordings, the
          avatar moves its lips. Different comments can have different
          speakers.

script:   dist/index.js

attribute: [DiceBear](https://www.dicebear.com) by Florian Körner is licensed
           under [MIT](https://github.com/dicebear/dicebear/blob/main/LICENSE),
           the individual avatar styles come with their own
           [licenses](https://www.dicebear.com/licenses/)

@VirtualSpeaker.speaker: <!-- data-speaker="@0" -->

@VirtualSpeaker.dicebear: <!-- data-speaker-style="@0" data-speaker-seed="@1" -->
-->

# Virtual Speaker

    @VirtualSpeaker.speaker(andre-dietrich)
    --{{0}}--
Hello, I am André, the virtual speaker of this course. Whenever LiaScript reads
a comment aloud, I move my lips. You can drag me around and resize me, just
like the video comments.

This template adds an animated [DiceBear](https://www.dicebear.com) avatar to
the narrator comments of LiaScript. While a comment is read aloud, either by
the text-to-speech of the browser or from an audio recording, the avatar moves
its lips. It lives in the same draggable and resizable overlay as the video
comments and can be switched off in the settings.

__Try it:__ switch to the presentation or slides mode, turn on the sound, and
step through this course.

> [!NOTE]
> The avatar requires the narrator hook `window.LIA.narrator` of LiaScript,
> which is part of the `development` branch and will be available with the
> next release.

---

Import via:

`import: https://raw.githubusercontent.com/LiaTemplates/virtual-speaker/main/README.md`

or use a fixed version:

`import: https://raw.githubusercontent.com/LiaTemplates/virtual-speaker/0.1.1/README.md`

## The default speaker

    @VirtualSpeaker.speaker(andre-dietrich)
    --{{0}}--
Without further configuration, every comment is spoken by the default speaker.
In this course I am put in front of every comment with the speaker macro
instead, the warning below explains why.

The default speaker is defined once in the header of your course, by an
`@onload` script:

``` html
<!--
import: https://raw.githubusercontent.com/LiaTemplates/virtual-speaker/main/README.md

@onload
window.VirtualSpeakerConfig = {
  default:  { style: 'lorelei', seed: 'Mika', name: 'Mika' },
  speakers: { anna: { style: 'micah', seed: 'Anna', name: 'Anna' } }
}
@end
-->
```

> `@onload` might run before the script of this template is loaded, therefore
> the configuration is assigned to `window.VirtualSpeakerConfig`, which is
> picked up in either case.

> [!WARNING]
> Configure speakers only in courses, not in the header of a template. The
> `@onload` of a template is also executed by every course that imports it
> and would override its configuration. That is why this course does not
> define a default speaker.

* `style`: one of the [DiceBear styles](https://www.dicebear.com/styles/),
  e.g. `avataaars`, `lorelei`, `micah`, `adventurer`, `bottts`, `notionists`,
  `big-smile`, `personas`, `fun-emoji`, `pixel-art`, …
* `seed`: any text, the same seed always results in the same face
* `options`: further [DiceBear options](https://www.dicebear.com/how-to-use/js-library/)
  of the style, such as `{ hair: ['long20'], backgroundColor: ['b6e3f4'] }`
* `name`: shown as tooltip
* `patterns`: replaces a color of the options by a pattern, which DiceBear
  does not offer, e.g. a checkered shirt:

  ``` js
  { style: 'avataaars', seed: 'André',
    options:  { clothing: ['collarAndSweater'], clothesColor: ['010203'] },
    patterns: { '010203': 'plaid-blue' } }   // plaid-red, plaid-green
  ```

  `{ '010203': { name: 'plaid-blue', rotate: 45 } }` rotates the pattern.

Without any configuration the avatar is drawn in the `avataaars` style and the
narrator voice is used as seed, such that different voices look different.

## Changing the speaker

    @VirtualSpeaker.speaker(andre-dietrich)
    --{{0}}--
I am still André, but listen to the next comment.

    @VirtualSpeaker.speaker(anna)
    --{{1 UK English Female}}--
Hi, I am Anna. My name was put in front of this comment with the speaker
macro, so you see me instead of André.

    @VirtualSpeaker.dicebear(bottts,R2)
    --{{2 US English Male}}--
Beep. I am a robot, created on the fly with the dicebear macro.

    --{{3 UK English Male}}--
And I am Felix. Nobody announced me, but I have been registered for the voice
UK English Male.

Put one of the following macros directly in front of a narrator comment:

* `@VirtualSpeaker.speaker(anna)`: a speaker defined with
  `VirtualSpeaker.config({ speakers: { anna: {...} } })`. Unknown names are
  drawn in the default style with the name as seed.
* `@VirtualSpeaker.dicebear(bottts,R2)`: any DiceBear style and seed, without
  any configuration.

Speakers can also be registered for a narrator voice, such as
`'UK English Male'`, then all comments with this voice get this face. On this
slide, Anna and Felix are defined by a small script:

``` html
<script style="display: none">
VirtualSpeaker.define('anna', { style: 'micah', seed: 'Anna', name: 'Anna' })
VirtualSpeaker.define('UK English Male', { style: 'avataaars', seed: 'Felix', name: 'Felix' })
</script>
```

<script style="display: none">
VirtualSpeaker.define('anna', { style: 'micah', seed: 'Anna', name: 'Anna' })
VirtualSpeaker.define('UK English Male', { style: 'avataaars', seed: 'Felix', name: 'Felix' })
</script>

``` markdown
    @VirtualSpeaker.speaker(anna)
    --{{1 UK English Female}}--
Hi, I am Anna.

    @VirtualSpeaker.dicebear(bottts,R2)
    --{{2 US English Male}}--
Beep. I am a robot.
```

          {{1}}
> Anna (style `micah`)

          {{2}}
> R2 (style `bottts`)

          {{3}}
> Felix (style `avataaars`, voice `UK English Male`)

## Predefined speakers

    @VirtualSpeaker.speaker(andre-dietrich)
    --{{0 US English Male}}--
You already know me, I am André, and I am already part of this template. So
you can invite me to your course without any configuration.

    @VirtualSpeaker.speaker(sebastian-zug)
    --{{1 US English Male}}--
And I am Sebastian. Just like André, I am predefined in this template.

Some speakers are already defined in this template and can be used directly:

| Id               | Name           | Style       |
| ---------------- | -------------- | ----------- |
| `andre-dietrich` | André Dietrich | `avataaars` |
| `sebastian-zug`  | Sebastian Zug  | `avataaars` |

``` markdown
    @VirtualSpeaker.speaker(andre-dietrich)
    --{{0}}--
Hi, I am André.
```

A predefined speaker can also be the default speaker of your course:

``` html
<!--
@onload
window.VirtualSpeakerConfig = { default: 'andre-dietrich' }
@end
-->
```

> Want to add yourself? Speakers are defined in `src/presets.ts`, please only
> add living people who agreed to it. Historical figures are collected in
> `src/famous.ts`.

## Famous people

    @VirtualSpeaker.speaker(andre-dietrich)
    --{{0}}--
Some famous guests from all continents have joined this template. Step through
this slide and let them introduce themselves.

    @VirtualSpeaker.speaker(albert-einstein)
    --{{1 US English Male}}--
Hello, I am Albert Einstein. Imagination is more important than knowledge,
so let us explore space and time together.

    @VirtualSpeaker.speaker(confucius)
    --{{2 UK English Male}}--
I am Confucius, a teacher from ancient China. Learning without thinking is
useless, thinking without learning is dangerous.

    @VirtualSpeaker.speaker(wangari-maathai)
    --{{3 UK English Female}}--
I am Wangari Maathai from Kenya. Together with many women, I planted millions
of trees. Every small step counts.

    @VirtualSpeaker.speaker(frida-kahlo)
    --{{4 US English Female}}--
I am Frida Kahlo, a painter from Mexico. I painted my own reality, and you can
paint yours.

    @VirtualSpeaker.speaker(alberto-santos-dumont)
    --{{5 US English Male}}--
I am Alberto Santos-Dumont from Brazil, one of the first people to fly an
airplane. Look up, the sky is not the limit.

    @VirtualSpeaker.speaker(david-unaipon)
    --{{6 Australian Male}}--
I am David Unaipon, a Ngarrindjeri inventor and writer from Australia. You can
find me on the fifty dollar note.

    @VirtualSpeaker.speaker(roald-amundsen)
    --{{7 UK English Male}}--
I am Roald Amundsen. In 1911, my team was the first to reach the South Pole.
Do not forget your warm hat.

    @VirtualSpeaker.speaker(emmeline-pankhurst)
    --{{8 UK English Female}}--
I am Emmeline Pankhurst. We fought for the right of women to vote. Deeds, not
words!

    @VirtualSpeaker.speaker(celestin-freinet)
    --{{9 French Male}}--
Bonjour, je suis Célestin Freinet. Dans ma classe, les enfants imprimaient
leurs propres textes.

These historical figures are predefined and can be used like any other
speaker, e.g. as guests in a history, science or literature course:

``` markdown
    @VirtualSpeaker.speaker(marie-curie)
    --{{0}}--
I am Marie Curie, and I won two Nobel Prizes.
```

| Id                           | Name                       | Lifetime          | Known for                                       | Continent (country)          | Style        | More                                                                                |
| ---------------------------- | -------------------------- | ----------------- | ----------------------------------------------- | ---------------------------- | ------------ | ----------------------------------------------------------------------------------- |
| `albert-einstein`            | Albert Einstein            | 1879–1955         | theory of relativity                            | Europe (Germany)             | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Albert_Einstein)                          |
| `isaac-newton`               | Isaac Newton               | 1643–1727         | gravitation, laws of motion                     | Europe (England)             | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Isaac_Newton)                             |
| `marie-curie`                | Marie Curie                | 1867–1934         | radioactivity, two Nobel Prizes                 | Europe (Poland, France)      | `toon-head`  | [Wikipedia](https://en.wikipedia.org/wiki/Marie_Curie)                              |
| `johann-wolfgang-von-goethe` | Johann Wolfgang von Goethe | 1749–1832         | poet, _Faust_                                   | Europe (Germany)             | `toon-head`  | [Wikipedia](https://en.wikipedia.org/wiki/Johann_Wolfgang_von_Goethe)               |
| `friedrich-schiller`         | Friedrich Schiller         | 1759–1805         | poet, _Ode to Joy_                              | Europe (Germany)             | `toon-head`  | [Wikipedia](https://en.wikipedia.org/wiki/Friedrich_Schiller)                       |
| `leonardo-da-vinci`          | Leonardo da Vinci          | 1452–1519         | painter, inventor, _Mona Lisa_                  | Europe (Italy)               | `toon-head`  | [Wikipedia](https://en.wikipedia.org/wiki/Leonardo_da_Vinci)                        |
| `ada-lovelace`               | Ada Lovelace               | 1815–1852         | first computer program                          | Europe (England)             | `lorelei`    | [Wikipedia](https://en.wikipedia.org/wiki/Ada_Lovelace)                             |
| `charles-darwin`             | Charles Darwin             | 1809–1882         | theory of evolution                             | Europe (England)             | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Charles_Darwin)                           |
| `galileo-galilei`            | Galileo Galilei            | 1564–1642         | astronomy, telescope                            | Europe (Italy)               | `micah`      | [Wikipedia](https://en.wikipedia.org/wiki/Galileo_Galilei)                          |
| `christopher-columbus`       | Christopher Columbus       | 1451–1506         | voyages to the Americas, 1492                   | Europe (Genoa, Spain)        | `toon-head`  | [Wikipedia](https://en.wikipedia.org/wiki/Christopher_Columbus)                     |
| `wolfgang-amadeus-mozart`    | Wolfgang Amadeus Mozart    | 1756–1791         | composer                                        | Europe (Austria)             | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Wolfgang_Amadeus_Mozart)                  |
| `sophie-scholl`              | Sophie Scholl              | 1921–1943         | resistance against the Nazis, White Rose        | Europe (Germany)             | `lorelei`    | [Wikipedia](https://en.wikipedia.org/wiki/Sophie_Scholl)                            |
| `emmy-noether`               | Emmy Noether               | 1882–1935         | mathematics, Noether's theorem                  | Europe (Germany)             | `micah`      | [Wikipedia](https://en.wikipedia.org/wiki/Emmy_Noether)                             |
| `celestin-freinet`           | Célestin Freinet           | 1896–1966         | school printing press, Freinet pedagogy         | Europe (France)              | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/C%C3%A9lestin_Freinet)                    |
| `maria-montessori`           | Maria Montessori           | 1870–1952         | Montessori education                            | Europe (Italy)               | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Maria_Montessori)                         |
| `john-amos-comenius`         | John Amos Comenius         | 1592–1670         | father of modern education, _Orbis Pictus_      | Europe (Moravia, Czechia)    | `toon-head`  | [Wikipedia](https://en.wikipedia.org/wiki/John_Amos_Comenius)                       |
| `johann-heinrich-pestalozzi` | Johann Heinrich Pestalozzi | 1746–1827         | education with head, heart and hand             | Europe (Switzerland)         | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Johann_Heinrich_Pestalozzi)               |
| `alan-turing`                | Alan Turing                | 1912–1954         | Turing machine, computer science                | Europe (England)             | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Alan_Turing)                              |
| `carl-friedrich-gauss`       | Carl Friedrich Gauss       | 1777–1855         | mathematics, normal distribution                | Europe (Germany)             | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Carl_Friedrich_Gauss)                     |
| `leonhard-euler`             | Leonhard Euler             | 1707–1783         | mathematics, Euler's number _e_                 | Europe (Switzerland, Russia) | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Leonhard_Euler)                           |
| `konrad-zuse`                | Konrad Zuse                | 1910–1995         | Z3, first programmable computer                 | Europe (Germany)             | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Konrad_Zuse)                              |
| `socrates`                   | Socrates                   | c. 470–399 BC     | philosopher, Socratic method                    | Europe (Greece)              | `toon-head`  | [Wikipedia](https://en.wikipedia.org/wiki/Socrates)                                 |
| `immanuel-kant`              | Immanuel Kant              | 1724–1804         | philosopher, _Critique of Pure Reason_          | Europe (Prussia)             | `toon-head`  | [Wikipedia](https://en.wikipedia.org/wiki/Immanuel_Kant)                            |
| `gregor-mendel`              | Gregor Mendel              | 1822–1884         | laws of heredity, pea plants                    | Europe (Austria, Czechia)    | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Gregor_Mendel)                            |
| `dmitri-mendeleev`           | Dmitri Mendeleev           | 1834–1907         | periodic table                                  | Europe (Russia)              | `toon-head`  | [Wikipedia](https://en.wikipedia.org/wiki/Dmitri_Mendeleev)                         |
| `alexander-von-humboldt`     | Alexander von Humboldt     | 1769–1859         | naturalist and explorer                         | Europe (Germany)             | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Alexander_von_Humboldt)                   |
| `florence-nightingale`       | Florence Nightingale       | 1820–1910         | modern nursing, statistics                      | Europe (England)             | `lorelei`    | [Wikipedia](https://en.wikipedia.org/wiki/Florence_Nightingale)                     |
| `william-shakespeare`        | William Shakespeare        | 1564–1616         | playwright, _Hamlet_                            | Europe (England)             | `toon-head`  | [Wikipedia](https://en.wikipedia.org/wiki/William_Shakespeare)                      |
| `ludwig-van-beethoven`       | Ludwig van Beethoven       | 1770–1827         | composer, _Ninth Symphony_                      | Europe (Germany, Austria)    | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Ludwig_van_Beethoven)                     |
| `lise-meitner`               | Lise Meitner               | 1878–1968         | nuclear fission                                 | Europe (Austria, Sweden)     | `lorelei`    | [Wikipedia](https://en.wikipedia.org/wiki/Lise_Meitner)                             |
| `rosalind-franklin`          | Rosalind Franklin          | 1920–1958         | X-ray images of DNA                             | Europe (England)             | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Rosalind_Franklin)                        |
| `caroline-herschel`          | Caroline Herschel          | 1750–1848         | astronomer, comets                              | Europe (Germany, England)    | `lorelei`    | [Wikipedia](https://en.wikipedia.org/wiki/Caroline_Herschel)                        |
| `maria-sibylla-merian`       | Maria Sibylla Merian       | 1647–1717         | naturalist, metamorphosis of butterflies        | Europe (Germany)             | `lorelei`    | [Wikipedia](https://en.wikipedia.org/wiki/Maria_Sibylla_Merian)                     |
| `mary-anning`                | Mary Anning                | 1799–1847         | fossil hunter, ichthyosaurs                     | Europe (England)             | `lorelei`    | [Wikipedia](https://en.wikipedia.org/wiki/Mary_Anning)                              |
| `dorothy-hodgkin`            | Dorothy Hodgkin            | 1910–1994         | X-ray crystallography, Nobel Prize 1964         | Europe (England)             | `notionists` | [Wikipedia](https://en.wikipedia.org/wiki/Dorothy_Hodgkin)                          |
| `sofya-kovalevskaya`         | Sofya Kovalevskaya         | 1850–1891         | first woman with a doctorate in mathematics     | Europe (Russia, Sweden)      | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Sofya_Kovalevskaya)                       |
| `olympe-de-gouges`           | Olympe de Gouges           | 1748–1793         | _Declaration of the Rights of Woman_            | Europe (France)              | `lorelei`    | [Wikipedia](https://en.wikipedia.org/wiki/Olympe_de_Gouges)                         |
| `mary-wollstonecraft`        | Mary Wollstonecraft        | 1759–1797         | _A Vindication of the Rights of Woman_          | Europe (England)             | `lorelei`    | [Wikipedia](https://en.wikipedia.org/wiki/Mary_Wollstonecraft)                      |
| `emmeline-pankhurst`         | Emmeline Pankhurst         | 1858–1928         | suffragettes, votes for women                   | Europe (England)             | `toon-head`  | [Wikipedia](https://en.wikipedia.org/wiki/Emmeline_Pankhurst)                       |
| `clara-zetkin`               | Clara Zetkin               | 1857–1933         | International Women's Day                       | Europe (Germany)             | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Clara_Zetkin)                             |
| `elisabeth-selbert`          | Elisabeth Selbert          | 1896–1986         | equal rights in the German Basic Law            | Europe (Germany)             | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Elisabeth_Selbert)                        |
| `simone-de-beauvoir`         | Simone de Beauvoir         | 1908–1986         | philosopher, _The Second Sex_                   | Europe (France)              | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Simone_de_Beauvoir)                       |
| `confucius`                  | Confucius                  | 551–479 BC        | philosopher and teacher                         | Asia (China)                 | `toon-head`  | [Wikipedia](https://en.wikipedia.org/wiki/Confucius)                                |
| `mahatma-gandhi`             | Mahatma Gandhi             | 1869–1948         | non-violent independence movement               | Asia (India)                 | `micah`      | [Wikipedia](https://en.wikipedia.org/wiki/Mahatma_Gandhi)                           |
| `murasaki-shikibu`           | Murasaki Shikibu           | c. 973–c. 1014    | novelist, _The Tale of Genji_                   | Asia (Japan)                 | `lorelei`    | [Wikipedia](https://en.wikipedia.org/wiki/Murasaki_Shikibu)                         |
| `srinivasa-ramanujan`        | Srinivasa Ramanujan        | 1887–1920         | mathematics, number theory                      | Asia (India)                 | `notionists` | [Wikipedia](https://en.wikipedia.org/wiki/Srinivasa_Ramanujan)                      |
| `ibn-sina`                   | Ibn Sina (Avicenna)        | c. 980–1037       | medicine, philosophy                            | Asia (Persia)                | `micah`      | [Wikipedia](https://en.wikipedia.org/wiki/Avicenna)                                 |
| `zheng-he`                   | Zheng He                   | 1371–1433         | admiral, treasure voyages                       | Asia (China)                 | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Zheng_He)                                 |
| `rabindranath-tagore`        | Rabindranath Tagore        | 1861–1941         | poet, Nobel Prize in Literature                 | Asia (India)                 | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Rabindranath_Tagore)                      |
| `al-khwarizmi`               | Al-Khwarizmi               | c. 780–c. 850     | algebra, the word "algorithm"                   | Asia (Persia, Baghdad)       | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Al-Khwarizmi)                             |
| `chien-shiung-wu`            | Chien-Shiung Wu            | 1912–1997         | physics, Wu experiment                          | Asia (China, USA)            | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Chien-Shiung_Wu)                          |
| `maryam-mirzakhani`          | Maryam Mirzakhani          | 1977–2017         | first woman to win the Fields Medal             | Asia (Iran)                  | `micah`      | [Wikipedia](https://en.wikipedia.org/wiki/Maryam_Mirzakhani)                        |
| `janaki-ammal`               | Janaki Ammal               | 1897–1984         | botanist, sugarcane and eggplant                | Asia (India)                 | `micah`      | [Wikipedia](https://en.wikipedia.org/wiki/E._K._Janaki_Ammal)                       |
| `katsushika-hokusai`         | Katsushika Hokusai         | c. 1760–1849      | painter, _The Great Wave off Kanagawa_          | Asia (Japan)                 | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Hokusai)                                  |
| `subrahmanyan-chandrasekhar` | Subrahmanyan Chandrasekhar | 1910–1995         | astrophysics, Nobel Prize in Physics            | Asia (India, USA)            | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Subrahmanyan_Chandrasekhar)               |
| `savitribai-phule`           | Savitribai Phule           | 1831–1897         | girls' education, women's rights                | Asia (India)                 | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Savitribai_Phule)                         |
| `kartini`                    | Kartini                    | 1879–1904         | women's education                               | Asia (Indonesia)             | `toon-head`  | [Wikipedia](https://en.wikipedia.org/wiki/Kartini)                                  |
| `nelson-mandela`             | Nelson Mandela             | 1918–2013         | end of apartheid, president                     | Africa (South Africa)        | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Nelson_Mandela)                           |
| `wangari-maathai`            | Wangari Maathai            | 1940–2011         | Green Belt Movement, Nobel Peace Prize          | Africa (Kenya)               | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Wangari_Maathai)                          |
| `hypatia`                    | Hypatia                    | c. 360–415        | mathematics, astronomy                          | Africa (Alexandria, Egypt)   | `lorelei`    | [Wikipedia](https://en.wikipedia.org/wiki/Hypatia)                                  |
| `mansa-musa`                 | Mansa Musa                 | c. 1280–c. 1337   | ruler of the Mali Empire, Timbuktu              | Africa (Mali)                | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Mansa_Musa)                               |
| `ibn-battuta`                | Ibn Battuta                | 1304–1368/69      | traveller, _Rihla_                              | Africa (Morocco)             | `notionists` | [Wikipedia](https://en.wikipedia.org/wiki/Ibn_Battuta)                              |
| `miriam-makeba`              | Miriam Makeba              | 1932–2008         | singer, "Mama Africa"                           | Africa (South Africa)        | `micah`      | [Wikipedia](https://en.wikipedia.org/wiki/Miriam_Makeba)                            |
| `kofi-annan`                 | Kofi Annan                 | 1938–2018         | UN Secretary-General, Nobel Peace Prize         | Africa (Ghana)               | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Kofi_Annan)                               |
| `ibn-khaldun`                | Ibn Khaldun                | 1332–1406         | historian, _Muqaddimah_                         | Africa (Tunisia)             | `micah`      | [Wikipedia](https://en.wikipedia.org/wiki/Ibn_Khaldun)                              |
| `chinua-achebe`              | Chinua Achebe              | 1930–2013         | novelist, _Things Fall Apart_                   | Africa (Nigeria)             | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Chinua_Achebe)                            |
| `funmilayo-ransome-kuti`     | Funmilayo Ransome-Kuti     | 1900–1978         | women's rights, Abeokuta Women's Union          | Africa (Nigeria)             | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Funmilayo_Ransome-Kuti)                   |
| `huda-shaarawi`              | Huda Sha'arawi             | 1879–1947         | Egyptian Feminist Union                         | Africa (Egypt)               | `lorelei`    | [Wikipedia](https://en.wikipedia.org/wiki/Huda_Sha%27arawi)                         |
| `grace-alele-williams`       | Grace Alele-Williams       | 1932–2022         | first Nigerian woman with a PhD in mathematics  | Africa (Nigeria)             | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Grace_Alele-Williams)                     |
| `martin-luther-king`         | Martin Luther King Jr.     | 1929–1968         | civil rights movement, "I Have a Dream"         | North America (USA)          | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Martin_Luther_King_Jr.)                   |
| `rosa-parks`                 | Rosa Parks                 | 1913–2005         | civil rights, Montgomery bus boycott            | North America (USA)          | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Rosa_Parks)                               |
| `frida-kahlo`                | Frida Kahlo                | 1907–1954         | painter                                         | North America (Mexico)       | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Frida_Kahlo)                              |
| `benjamin-franklin`          | Benjamin Franklin          | 1706–1790         | electricity, lightning rod, statesman           | North America (USA)          | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Benjamin_Franklin)                        |
| `katherine-johnson`          | Katherine Johnson          | 1918–2020         | orbital mechanics at NASA                       | North America (USA)          | `micah`      | [Wikipedia](https://en.wikipedia.org/wiki/Katherine_Johnson)                        |
| `grace-hopper`               | Grace Hopper               | 1906–1992         | compilers, COBOL                                | North America (USA)          | `micah`      | [Wikipedia](https://en.wikipedia.org/wiki/Grace_Hopper)                             |
| `sequoyah`                   | Sequoyah                   | c. 1770–1843      | Cherokee syllabary                              | North America (Cherokee)     | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Sequoyah)                                 |
| `nikola-tesla`               | Nikola Tesla               | 1856–1943         | alternating current                             | North America (USA)          | `toon-head`  | [Wikipedia](https://en.wikipedia.org/wiki/Nikola_Tesla)                             |
| `susan-b-anthony`            | Susan B. Anthony           | 1820–1906         | women's suffrage                                | North America (USA)          | `lorelei`    | [Wikipedia](https://en.wikipedia.org/wiki/Susan_B._Anthony)                         |
| `sojourner-truth`            | Sojourner Truth            | c. 1797–1883      | abolition, "Ain't I a Woman?"                   | North America (USA)          | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Sojourner_Truth)                          |
| `rachel-carson`              | Rachel Carson              | 1907–1964         | _Silent Spring_, environmental movement         | North America (USA)          | `lorelei`    | [Wikipedia](https://en.wikipedia.org/wiki/Rachel_Carson)                            |
| `hedy-lamarr`                | Hedy Lamarr                | 1914–2000         | actress, frequency hopping                      | North America (Austria, USA) | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Hedy_Lamarr)                              |
| `simon-bolivar`              | Simón Bolívar              | 1783–1830         | independence of South America                   | South America (Venezuela)    | `toon-head`  | [Wikipedia](https://en.wikipedia.org/wiki/Sim%C3%B3n_Bol%C3%ADvar)                  |
| `gabriela-mistral`           | Gabriela Mistral           | 1889–1957         | poet, Nobel Prize in Literature                 | South America (Chile)        | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Gabriela_Mistral)                         |
| `alberto-santos-dumont`      | Alberto Santos-Dumont      | 1873–1932         | aviation pioneer                                | South America (Brazil)       | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Alberto_Santos-Dumont)                    |
| `paulo-freire`               | Paulo Freire               | 1921–1997         | _Pedagogy of the Oppressed_                     | South America (Brazil)       | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Paulo_Freire)                             |
| `pablo-neruda`               | Pablo Neruda               | 1904–1973         | poet, Nobel Prize in Literature                 | South America (Chile)        | `micah`      | [Wikipedia](https://en.wikipedia.org/wiki/Pablo_Neruda)                             |
| `machado-de-assis`           | Machado de Assis           | 1839–1908         | novelist, _Dom Casmurro_                        | South America (Brazil)       | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Machado_de_Assis)                         |
| `bertha-lutz`                | Bertha Lutz                | 1894–1976         | biologist, women's suffrage in Brazil           | South America (Brazil)       | `lorelei`    | [Wikipedia](https://en.wikipedia.org/wiki/Bertha_Lutz)                              |
| `david-unaipon`              | David Unaipon              | 1872–1967         | Ngarrindjeri inventor and writer                | Australia                    | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/David_Unaipon)                            |
| `albert-namatjira`           | Albert Namatjira           | 1902–1959         | Western Arrernte painter                        | Australia                    | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Albert_Namatjira)                         |
| `howard-florey`              | Howard Florey              | 1898–1968         | penicillin, Nobel Prize in Medicine             | Australia                    | `notionists` | [Wikipedia](https://en.wikipedia.org/wiki/Howard_Florey)                            |
| `kate-sheppard`              | Kate Sheppard              | 1847–1934         | women's suffrage, 1893                          | Oceania (New Zealand)        | `lorelei`    | [Wikipedia](https://en.wikipedia.org/wiki/Kate_Sheppard)                            |
| `apirana-ngata`              | Āpirana Ngata              | 1874–1950         | Māori politician and scholar                    | Oceania (New Zealand)        | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/%C4%80pirana_Ngata)                       |
| `whina-cooper`               | Whina Cooper               | 1895–1994         | Māori land rights, land march of 1975           | Oceania (New Zealand)        | `toon-head`  | [Wikipedia](https://en.wikipedia.org/wiki/Whina_Cooper)                             |
| `roald-amundsen`             | Roald Amundsen             | 1872–1928         | first to reach the South Pole, 1911             | Antarctica (Norway)          | `avataaars`  | [Wikipedia](https://en.wikipedia.org/wiki/Roald_Amundsen)                           |
| `ernest-shackleton`          | Ernest Shackleton          | 1874–1922         | Antarctic expeditions, _Endurance_              | Antarctica (Ireland, UK)     | `toon-head`  | [Wikipedia](https://en.wikipedia.org/wiki/Ernest_Shackleton)                        |

> The avatars are cartoons, loosely based on well-known portraits, not exact
> likenesses. Some figures, like Christopher Columbus, are seen very
> differently today, which can be a good starting point for a discussion.

### All predefined speakers

    @VirtualSpeaker.speaker(confucius)
    --{{0 UK English Male}}--
Here you can see all of us at once. Hover over a face to read the id.

All predefined speakers at once, `VirtualSpeaker.preview(id)` draws the
resting face of any named speaker:

```js
const html = VirtualSpeaker.presets().map(id => `
  <img src="${VirtualSpeaker.preview(id)}" title="${id}"
       style="width:80px; height:80px; margin:4px; border-radius:50%; background:#dfe7ef">`)

console.html(`<div style="display:flex; flex-wrap:wrap; white-space:normal">
  ${html.join('')}
</div>`)

VirtualSpeaker.presets().length + " speakers"
```
<script>@input</script>

## Styles

    @VirtualSpeaker.speaker(andre-dietrich)
    --{{0}}--
Let me introduce you to some other speakers. Every one of them is drawn in
another DiceBear style. Just step through this slide.

    @VirtualSpeaker.dicebear(adventurer,Ada)
    --{{1 UK English Female}}--
Hi, I am Ada, drawn in the adventurer style by Lisa Wischofsky.

    @VirtualSpeaker.dicebear(avataaars,Felix)
    --{{2 US English Male}}--
Hi, I am Felix, drawn in the avataaars style by Pablo Stanley.

    @VirtualSpeaker.dicebear(big-ears,Bea)
    --{{3 US English Female}}--
Hi, I am Bea, drawn in the big ears style by The Visual Team.

    @VirtualSpeaker.dicebear(big-smile,Ben)
    --{{4 UK English Male}}--
Hi, I am Ben, drawn in the big smile style by Ashley Seo.

    @VirtualSpeaker.dicebear(bottts,R2)
    --{{5 US English Male}}--
Hi, I am R2, drawn in the bottts style by Pablo Stanley.

    @VirtualSpeaker.dicebear(croodles,Cleo)
    --{{6 UK English Female}}--
Hi, I am Cleo, drawn in the croodles style by Vijay Verma.

    @VirtualSpeaker.dicebear(dylan,Dylan)
    --{{7 US English Male}}--
Hi, I am Dylan, drawn in the dylan style by Natalia Spivak. I cannot move my lips, so I just bob a little while I speak.

    @VirtualSpeaker.dicebear(fun-emoji,Smiley)
    --{{8 US English Female}}--
Hi, I am Smiley, drawn in the fun emoji style by Davis Uche.

    @VirtualSpeaker.dicebear(lorelei,Mika)
    --{{9 US English Female}}--
Hi, I am Mika, drawn in the lorelei style by Lisa Wischofsky.

    @VirtualSpeaker.dicebear(micah,Anna)
    --{{10 UK English Female}}--
Hi, I am Anna, drawn in the micah style by Micah Lanier.

    @VirtualSpeaker.dicebear(miniavs,Max)
    --{{11 UK English Male}}--
Hi, I am Max, drawn in the miniavs style by Webpixels. I cannot move my lips, so I just bob a little while I speak.

    @VirtualSpeaker.dicebear(notionists,Nora)
    --{{12 US English Female}}--
Hi, I am Nora, drawn in the notionists style by Zoish.

    @VirtualSpeaker.dicebear(open-peeps,Pete)
    --{{13 US English Male}}--
Hi, I am Pete, drawn in the open peeps style by Pablo Stanley. I cannot move my lips, so I just bob a little while I speak.

    @VirtualSpeaker.dicebear(personas,Paula)
    --{{14 UK English Female}}--
Hi, I am Paula, drawn in the personas style by Draftbit.

    @VirtualSpeaker.dicebear(pixel-art,Pixel)
    --{{15 US English Male}}--
Hi, I am Pixel, drawn in the pixel art style by DiceBear.

    @VirtualSpeaker.dicebear(thumbs,Tom)
    --{{16 UK English Male}}--
Hi, I am Tom, drawn in the thumbs style by DiceBear.

    @VirtualSpeaker.dicebear(toon-head,Toni)
    --{{17 US English Female}}--
Hi, I am Toni, drawn in the toon head style by Johan Melin.

All styles can be used with `@VirtualSpeaker.dicebear(style,seed)` or in
the configuration. The faces of the following styles are animated, the
others ([all styles](https://www.dicebear.com/styles/)) only bob while
speaking:

| Style        | Step | Lips | Blinks | Eyes look around | Creator         | License |
| ------------ | :--: | :--: | :----: | :--------------: | --------------- | ------- |
| `adventurer` | 1 | ✓ | ✓ |  | Lisa Wischofsky | CC BY 4.0 |
| `avataaars` | 2 | ✓ | ✓ | ✓ | Pablo Stanley | free for personal and commercial use |
| `big-ears` | 3 | ✓ | ✓ |  | The Visual Team | CC BY 4.0 |
| `big-smile` | 4 | ✓ | ✓ |  | Ashley Seo | CC BY 4.0 |
| `bottts` | 5 | ✓ |  |  | Pablo Stanley | free for personal and commercial use |
| `croodles` | 6 | ✓ | ✓ |  | Vijay Verma | CC BY 4.0 |
| `dylan` | 7 |  |  |  | Natalia Spivak | CC BY 4.0 |
| `fun-emoji` | 8 | ✓ | ✓ |  | Davis Uche | CC BY 4.0 |
| `lorelei` | 9 | ✓ | ✓ |  | Lisa Wischofsky | CC0 1.0 |
| `micah` | 10 | ✓ | ✓ |  | Micah Lanier | CC BY 4.0 |
| `miniavs` | 11 |  |  |  | Webpixels | CC BY 4.0 |
| `notionists` | 12 | ✓ |  |  | Zoish | CC0 1.0 |
| `open-peeps` | 13 |  |  |  | Pablo Stanley | CC0 1.0 |
| `personas` | 14 | ✓ | ✓ |  | Draftbit | CC BY 4.0 |
| `pixel-art` | 15 | ✓ |  |  | DiceBear | CC0 1.0 |
| `thumbs` | 16 | ✓ | ✓ |  | DiceBear | CC0 1.0 |
| `toon-head` | 17 | ✓ | ✓ |  | Johan Melin | CC BY 4.0 |

> All avatars turn their head when they look around, only the `avataaars`
> also have eyes looking to the side and up. The `-neutral` variants (only
> the face) of `adventurer`, `avataaars`, `big-ears`, `bottts`, `croodles`,
> `lorelei`, `notionists` and `pixel-art` are animated as well.

### Gallery

    @VirtualSpeaker.speaker(andre-dietrich)
    --{{0}}--
Here you can see all styles at once. Change the seed and run the code again.

Every DiceBear style with the same seed, change the `seed` and press run:

```js
const seed = 'Lia'

const html = VirtualSpeaker.styles().map(style => `
  <figure style="display:inline-block; margin:6px; text-align:center">
    <img src="${VirtualSpeaker.preview(style, seed)}"
         style="width:96px; height:96px; border-radius:50%; background:#dfe7ef">
    <figcaption><code>${style}</code></figcaption>
  </figure>`)

console.html(`<div style="display:flex; flex-wrap:wrap; white-space:normal">
  ${html.join('')}
</div>`)

"gallery with the seed " + seed
```
<script>@input</script>

### Playground

    @VirtualSpeaker.speaker(playground)
    --{{0}}--
This is your own speaker. Change the code, press run, and I will change too.
Then click the play button at the bottom to hear me again.

    @VirtualSpeaker.speaker(playground)
    --{{1 US English Male}}--
I am still your speaker, even with another voice.

Define your own speaker and press run. The speaker `playground` is used by
the comments of this slide, try other styles, seeds or
[options](https://www.dicebear.com/styles/) of the style:

```js
VirtualSpeaker.define('playground', {
  style: 'adventurer',
  seed: 'Lia',
  name: 'My speaker',
  options: {
    backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9'],
    hair: ['short16'],
  }
})

"done, have a look at the avatar"
```
<script>@input</script>

      {{1}}
> Every comment of this slide starts with
> `@VirtualSpeaker.speaker(playground)`.

## Audio recordings

    @VirtualSpeaker.speaker(andre-dietrich)
    --{{0}}--
?[](assets/recording.mp3)
This text is not spoken by the browser, the recording is played instead.

If a comment contains an audio recording, LiaScript plays it instead of the
text-to-speech output. The avatar then follows the loudness of the recording.

``` markdown
    --{{0}}--
?[](assets/recording.mp3)
This text is not spoken by the browser, the recording is played instead.
```

> Recordings from other domains can only be analysed, if they are served with
> CORS headers. Otherwise the avatar just flaps its mouth in a rhythm.

## Video comments

    @VirtualSpeaker.speaker(andre-dietrich)
    --{{0}}--
!?[](assets/video.mp4)
This comment comes with a video.

    @VirtualSpeaker.speaker(andre-dietrich)
    --{{1}}--
And now the avatar is back.

Videos within comments always take precedence over the avatar: while a
comment with a video is active, the video is shown in the overlay.

``` markdown
    --{{0}}--
!?[](assets/video.mp4)
This comment comes with a video.
```

          {{1}}
If the course is translated, LiaScript overlays the video with the
text-to-speech output of the new language. Then, too, the video is shown.

## Settings

    @VirtualSpeaker.speaker(andre-dietrich)
    --{{0}}--
Open the settings and check the option to hide the video and avatar comments,
and I will disappear.

The avatar is shown in the presentation and slides mode, whenever the current
animation step has a narrator comment and the sound is turned on. It is hidden

* in the textbook mode,
* if the sound is turned off,
* or if the option __hide video & avatar comments__ is checked in the
  settings.

Every learner can drag the avatar to another place, resize it with the
handle, or double-click it to make it follow the mouse.

## JavaScript API

    @VirtualSpeaker.speaker(andre-dietrich)
    --{{0}}--
Speakers can also be changed with a few lines of JavaScript.

``` js
// default speaker and named speakers (same as window.VirtualSpeakerConfig)
VirtualSpeaker.config({
  default:  { style: 'notionists', seed: 'Lia' },
  speakers: { anna: { style: 'micah', seed: 'Anna' } }
})

// a predefined or named speaker as default
VirtualSpeaker.config({ default: 'sebastian-zug' })

// add or replace a single speaker
VirtualSpeaker.define('bob', { style: 'adventurer', seed: 'Bob' })

// all available styles
VirtualSpeaker.styles()

// the resting face as image (data URI)
VirtualSpeaker.preview('lorelei', 'Mika')
VirtualSpeaker.preview('confucius')   // of a named or predefined speaker

// the ids of all predefined speakers
VirtualSpeaker.presets()

// remove and show the avatar again
VirtualSpeaker.disable()
VirtualSpeaker.enable()
```

The background of the avatar can be changed with the CSS variable
`--virtual-speaker-background`:

``` html
<!--
@style
lia-dicebear-avatar { --virtual-speaker-background: #fdf6e3; }
@end
-->
```

## Building your own avatar

    @VirtualSpeaker.speaker(andre-dietrich)
    --{{0}}--
This template is only one possible avatar. LiaScript offers a general hook,
which can be used for other avatars as well.

An avatar is a custom element, that registers itself at LiaScript:

``` js
customElements.define('my-avatar', class extends HTMLElement {
  connectedCallback() {
    window.addEventListener('lia-narrator', this.listen = (e) => {
      // e.detail.type:   start, stop, pause, resume, boundary, progress,
      //                  media, error
      // e.detail.source: tts, audio, video
      // e.detail.media:  the playing audio or video element
      this.classList.toggle('speaking', e.detail.status === 'speaking')
    })
  }
  disconnectedCallback() {
    window.removeEventListener('lia-narrator', this.listen)
  }
})

window.LIA.narrator.registerAvatar('my-avatar')
```

LiaScript renders this element within the overlay of the narrator comments,
whenever the current animation step has comments, but no video. It gets the
following attributes:

* `data-voice`: the narrator voice of the comment
* `data-step`: the current animation step
* all `data-*` annotations in front of the comment, e.g.
  `<!-- data-speaker="anna" -->`

The current state can also be read at any time via
`window.LIA.narrator.state`.

## Implementation

The JavaScript is written in TypeScript and bundled with Parcel:

``` bash
npm install
npm run build          # src/ → dist/index.js
npm test               # unit tests
npm run contact-sheet  # all mouth variants of all styles → contact-sheet.html
```

``` html
<!--
script:   dist/index.js

@VirtualSpeaker.speaker: <!-- data-speaker="@0" -->

@VirtualSpeaker.dicebear: <!-- data-speaker-style="@0" data-speaker-seed="@1" -->
-->
```

The mouth variants that are used for the animation of every DiceBear style
are defined in `src/faces.ts`, together with the eyes for blinking and
looking around. Styles without suitable variants (e.g.
`shapes`, `initials`, `open-peeps`) only bob while speaking.
