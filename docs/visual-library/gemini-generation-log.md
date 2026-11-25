# Gemini generation log (internal)

Tool: Gemini website (gemini.google.com), Lutty's own signed-in account, browser only. No API, no keys, no paid services.

## Outcome (2026-11-25): stopped at Lutty's request

- Test 1 (wide dance floor) worked on the Pro account (luttymedia, opened via gemini.google.com/u/1/): `gemini-tests/gen-test-01-wide-dance-floor.jpg`, 1696x2528, original Gemini file with its C2PA "AI-generated" provenance data intact. Watermark removed, foreground people replaced; one mid-ground couple still matches the reference (a follow-up asking to replace them was refused).
- Test 2 (close-up couple, ref 0011): two chats, both failed ("Something went wrong" / "I'm having a hard time fulfilling your request"), including a reworded prompt.
- Test 3 (lighting, ref 1521): refused with "Sorry, I can't generate unsafe images."
- Finding: Gemini accepts crowd scenes but refuses or errors on close-ups that ask it to replace identifiable real people. Not worked around.
- Lutty then chose to use their own edited photos from `albums/event` instead.

## Base prompt (shared by all tests)

> Use the uploaded photo only as a reference for style. Create a new, realistic photograph that keeps the same camera angle, framing, composition, lighting, colour palette, motion blur, depth of field and overall atmosphere, and the same dance positions and connection between partners. Replace every person with entirely different, fictional adults: different faces, hairstyles and body details, so that nobody resembles the people in the reference. Vary gender presentation and ethnicity naturally, without stereotypes. Keep clothing in a similar style and colour range. Remove all logos, watermarks, text overlays and printed lettering on clothing. Hands, fingers, arms and bodies must be anatomically correct, and the dance hold must look like real social dancing. It must look like an unretouched editorial event photograph taken with a professional camera, not an illustration, 3D render or obviously AI-generated image. Keep the same aspect ratio.

## Tests

### Test 1: wide dance floor

- Reference: catalogue 1385, `LMP07275.jpg`, `D:\Pictures\2026\314-Nov26\03-TBEX26 - 19-22nov26\TBEX26 - 19-22nov26 - Processed\TBEX26 - 21nov26 - Processed\07.Sat Social\LMP07275.jpg`
- Extra prompt: "This is a wide shot of a crowded social dance floor under purple and magenta laser beams in haze. Keep the crowd density, the lasers and the glowing screen at the back, but show no readable text or logo on the screen."
- 2026-11-25, attempts run on the WRONG Google account (lewtchy, not the Pro account), Gemini chat "Crowd Dancing Under Lasers". To be redone on luttymedia.
  - v1: watermark removed and lead dancer replaced, but most people near the camera unchanged. Rejected.
  - v2 (follow-up: "every single person must be different..."): foreground couples fully new and photographic, hands fine; a mid-ground couple still matches the reference. Output 848x1264. Acceptable under Lutty's later rule that wide crowd shots need not replace everyone. Kept in scratch only, not saved to images/blog.
  - v3 (asked to replace the remaining couple): generated, not downloaded.
- Status: redo on Pro account pending

### Test 2: close-up couple

- Reference: catalogue 0011, `LMP00538.jpg`, `D:\Pictures\2026\313-Oct26\01-CBC26 - 02-04oct26\CBC26 - 02-04oct26 - Processed\CBC26 - 02oct26 - Processed\01.Friday Social\LMP00538.jpg`
- Extra prompt: "This is a tight vertical portrait of a couple dancing bachata in close embrace in a dark club with blue and magenta light. Keep the relaxed, eyes-closed expression of the follower and the gentle hand placement."
- Status: pending (browser access)

### Test 3: lighting and composition

- Reference: catalogue 1521, `LMP07947.jpg`, `D:\Pictures\2026\314-Nov26\03-TBEX26 - 19-22nov26\TBEX26 - 19-22nov26 - Processed\TBEX26 - 21nov26 - Processed\07.Sat Social\LMP07947.jpg`
- Extra prompt: "This is a tilted, dynamic frame of a couple mid-turn: the follower's hair is flying, the leader holds her hand high. Keep the saturated magenta light, the tilt and the motion."
- Status: pending (browser access)
