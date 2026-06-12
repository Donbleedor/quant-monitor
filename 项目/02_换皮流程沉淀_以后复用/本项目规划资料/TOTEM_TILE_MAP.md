# Totem Tile Map

Date: 2026-06-10

Purpose:

- Preserve the existing engine's 34 logical `typeId` values.
- Replace all traditional mahjong visual meanings with totem tile identities.
- Keep gameplay matching logic unchanged.

## 1. Mapping Rules

Old logic:

- `typeId` is the only thing used for pair matching.
- Current visible identity comes from `TILE_TYPES` plus `SUIT_LABELS`.

New logic:

- Keep `id: 0..33`.
- Add `family`, `code`, `name`, `shortMark`, `asset`, and `accent`.
- Render symbol PNG plus optional small mark.
- Do not render Chinese text or old suit labels.

## 2. Family Design

| Family | IDs | Accent | Role |
| --- | --- | --- | --- |
| Nature | 0-8 | `#2F7A4B` | Organic shapes, easy recognition |
| Craft | 9-17 | `#B65A22` | Objects and game-like artifacts |
| Pattern | 18-26 | `#173650` | Geometric cloth/carving symbols |
| Special | 27-33 | `#D6A648` | Higher-value abstract marks |

Short marks:

- Use tiny corner marks for readability, not large text.
- Suggested runtime display: family dot + small number, or tiny numeral only.
- If text feels too busy, hide `shortMark` and rely on symbol shape/color.

## 3. 34 Tile Identities

| ID | Old source | New code | Name | Family | Accent | Asset |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | wan 1 | `sun_seed` | Sun Seed | nature | `#C77A2A` | `assets/generated/tiles/tile_totem_01_sun_seed.png` |
| 1 | wan 2 | `twin_leaves` | Twin Leaves | nature | `#2F7A4B` | `assets/generated/tiles/tile_totem_02_twin_leaves.png` |
| 2 | wan 3 | `branch_cluster` | Branch Cluster | nature | `#2F7A4B` | `assets/generated/tiles/tile_totem_03_branch_cluster.png` |
| 3 | wan 4 | `flower_cross` | Flower Cross | nature | `#D6A648` | `assets/generated/tiles/tile_totem_04_flower_cross.png` |
| 4 | wan 5 | `palm_fan` | Palm Fan | nature | `#2F7A4B` | `assets/generated/tiles/tile_totem_05_palm_fan.png` |
| 5 | wan 6 | `rain_pair` | Rain Pair | nature | `#2D6E8E` | `assets/generated/tiles/tile_totem_06_rain_pair.png` |
| 6 | wan 7 | `water_wave` | Water Wave | nature | `#173650` | `assets/generated/tiles/tile_totem_07_water_wave.png` |
| 7 | wan 8 | `mountain_chevron` | Mountain Chevron | nature | `#6F5A2E` | `assets/generated/tiles/tile_totem_08_mountain_chevron.png` |
| 8 | wan 9 | `star_blossom` | Star Blossom | nature | `#D6A648` | `assets/generated/tiles/tile_totem_09_star_blossom.png` |
| 9 | tong 1 | `talking_drum` | Talking Drum | craft | `#B65A22` | `assets/generated/tiles/tile_totem_10_talking_drum.png` |
| 10 | tong 2 | `round_shield` | Round Shield | craft | `#D6A648` | `assets/generated/tiles/tile_totem_11_round_shield.png` |
| 11 | tong 3 | `cowrie_shell` | Cowrie Shell | craft | `#E9DAB6` | `assets/generated/tiles/tile_totem_12_cowrie_shell.png` |
| 12 | tong 4 | `woven_basket` | Woven Basket | craft | `#B65A22` | `assets/generated/tiles/tile_totem_13_woven_basket.png` |
| 13 | tong 5 | `clay_pot` | Clay Pot | craft | `#A94C1E` | `assets/generated/tiles/tile_totem_14_clay_pot.png` |
| 14 | tong 6 | `comb_pick` | Comb Pick | craft | `#6F4B2A` | `assets/generated/tiles/tile_totem_15_comb_pick.png` |
| 15 | tong 7 | `bronze_bell` | Bronze Bell | craft | `#D6A648` | `assets/generated/tiles/tile_totem_16_bronze_bell.png` |
| 16 | tong 8 | `spear_tip` | Spear Tip | craft | `#7B5B35` | `assets/generated/tiles/tile_totem_17_spear_tip.png` |
| 17 | tong 9 | `gold_bead` | Gold Bead | craft | `#F4C95D` | `assets/generated/tiles/tile_totem_18_gold_bead.png` |
| 18 | tiao 1 | `diamond_knot` | Diamond Knot | pattern | `#173650` | `assets/generated/tiles/tile_totem_19_diamond_knot.png` |
| 19 | tiao 2 | `zigzag_cloth` | Zigzag Cloth | pattern | `#173650` | `assets/generated/tiles/tile_totem_20_zigzag_cloth.png` |
| 20 | tiao 3 | `triple_triangle` | Triple Triangle | pattern | `#2F7A4B` | `assets/generated/tiles/tile_totem_21_triple_triangle.png` |
| 21 | tiao 4 | `spiral_sun` | Spiral Sun | pattern | `#C77A2A` | `assets/generated/tiles/tile_totem_22_spiral_sun.png` |
| 22 | tiao 5 | `cross_weave` | Cross Weave | pattern | `#173650` | `assets/generated/tiles/tile_totem_23_cross_weave.png` |
| 23 | tiao 6 | `step_motif` | Step Motif | pattern | `#6F5A2E` | `assets/generated/tiles/tile_totem_24_step_motif.png` |
| 24 | tiao 7 | `ring_glyph` | Ring Glyph | pattern | `#D6A648` | `assets/generated/tiles/tile_totem_25_ring_glyph.png` |
| 25 | tiao 8 | `blue_stripe` | Blue Stripe | pattern | `#173650` | `assets/generated/tiles/tile_totem_26_blue_stripe.png` |
| 26 | tiao 9 | `green_lattice` | Green Lattice | pattern | `#2F7A4B` | `assets/generated/tiles/tile_totem_27_green_lattice.png` |
| 27 | feng east | `mask_mark` | Mask Mark | special | `#D6A648` | `assets/generated/tiles/tile_totem_28_mask_mark.png` |
| 28 | feng south | `baobab_tree` | Baobab Tree | special | `#2F7A4B` | `assets/generated/tiles/tile_totem_29_baobab_tree.png` |
| 29 | feng west | `moon_bowl` | Moon Bowl | special | `#E9DAB6` | `assets/generated/tiles/tile_totem_30_moon_bowl.png` |
| 30 | feng north | `fire_mark` | Fire Mark | special | `#B65A22` | `assets/generated/tiles/tile_totem_31_fire_mark.png` |
| 31 | jian red | `water_drop` | Water Drop | special | `#173650` | `assets/generated/tiles/tile_totem_32_water_drop.png` |
| 32 | jian green | `crown_token` | Crown Token | special | `#D6A648` | `assets/generated/tiles/tile_totem_33_crown_token.png` |
| 33 | jian white | `heritage_knot` | Heritage Knot | special | `#2F7A4B` | `assets/generated/tiles/tile_totem_34_heritage_knot.png` |

## 4. Implementation Notes

Recommended `data.js` object shape:

```js
{
  id: 0,
  family: 'nature',
  code: 'sun_seed',
  name: 'Sun Seed',
  shortMark: '1',
  asset: 'assets/generated/tiles/tile_totem_01_sun_seed.png',
  accent: '#C77A2A'
}
```

`SUIT_LABELS` should no longer be used for visible rendering.

`ui.js` should render:

```html
<span class="tile-face">
  <img class="tile-symbol" src="..." alt="">
  <span class="tile-mark">1</span>
</span>
```

Fallback if `asset` is missing:

- Show `shortMark` and `name` initials.
- Never fall back to Chinese mahjong text.

