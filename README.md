<!--
author:   André Dietrich
email:    LiaScript@web.de
version:  0.1.0
language: en
narrator: US English Female

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

@onload
window.VirtualSpeakerConfig = {
  default:  { style: 'lorelei', seed: 'Mika', name: 'Mika' },
  speakers: {
    anna: { style: 'micah', seed: 'Anna', name: 'Anna' },
    'US English Male': { style: 'avataaars', seed: 'Felix', name: 'Felix' }
  }
}
@end
-->

# Virtual Speaker

    --{{0}}--
Hello, I am Mika, the virtual speaker of this course. Whenever LiaScript reads
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

`import: https://raw.githubusercontent.com/LiaTemplates/virtual-speaker/0.1.0/README.md`

## The default speaker

    --{{0}}--
Without further configuration, every comment is spoken by the default speaker.
This course uses Mika, drawn in the lorelei style.

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

* `style`: one of the [DiceBear styles](https://www.dicebear.com/styles/),
  e.g. `avataaars`, `lorelei`, `micah`, `adventurer`, `bottts`, `notionists`,
  `big-smile`, `personas`, `fun-emoji`, `pixel-art`, …
* `seed`: any text, the same seed always results in the same face
* `options`: further [DiceBear options](https://www.dicebear.com/how-to-use/js-library/)
  of the style, such as `{ hair: ['long20'], backgroundColor: ['b6e3f4'] }`
* `name`: shown as tooltip

Without any configuration the avatar is drawn in the `avataaars` style and the
narrator voice is used as seed, such that different voices look different.

## Changing the speaker

    --{{0}}--
I am still Mika, but listen to the next comment.

    @VirtualSpeaker.speaker(anna)
    --{{1 UK English Female}}--
Hi, I am Anna. My name was put in front of this comment with the speaker
macro, so you see me instead of Mika.

    @VirtualSpeaker.dicebear(bottts,R2)
    --{{2 US English Male}}--
Beep. I am a robot, created on the fly with the dicebear macro.

    --{{3 US English Male}}--
And I am Felix. Nobody announced me, but I have been registered for the voice
US English Male.

Put one of the following macros directly in front of a narrator comment:

* `@VirtualSpeaker.speaker(anna)`: a speaker defined with
  `VirtualSpeaker.config({ speakers: { anna: {...} } })`. Unknown names are
  drawn in the default style with the name as seed.
* `@VirtualSpeaker.dicebear(bottts,R2)`: any DiceBear style and seed, without
  any configuration.

Speakers can also be registered for a narrator voice, such as
`'US English Male'`, then all comments with this voice get this face.

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
> Felix (style `avataaars`, voice `US English Male`)

## Styles

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

document.getElementById('vs-gallery').innerHTML = html.join('')

"gallery with the seed " + seed
```
<script>@input</script>

<div id="vs-gallery"></div>

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

    --{{0}}--
!?[](assets/video.mp4)
This comment comes with a video.

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

    --{{0}}--
Speakers can also be changed with a few lines of JavaScript.

``` js
// default speaker and named speakers (same as window.VirtualSpeakerConfig)
VirtualSpeaker.config({
  default:  { style: 'notionists', seed: 'Lia' },
  speakers: { anna: { style: 'micah', seed: 'Anna' } }
})

// add or replace a single speaker
VirtualSpeaker.define('bob', { style: 'adventurer', seed: 'Bob' })

// all available styles
VirtualSpeaker.styles()

// the resting face as image (data URI)
VirtualSpeaker.preview('lorelei', 'Mika')

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
