import { ShowingNoteProps } from '../../utils/showingNoteProps';
import { cos, sin, π } from '../../math';
import {
  center,
  maimaiSummonLineR,
  maimaiScreenR,
  maimaiBR,
  maimaiER,
  touchMaxDistance,
  maimaiTapR,
  trackItemGap,
  trackItemWidth,
  trackItemHeight,
  holdHeadHeight,
  canvasWidth,
  maimaiADTouchR,
} from '../global';
import { Note, NoteType } from '../maireader';
import { getTrackProps } from '../slideTracks/tracks';
import { APositions, trackLength } from '../slideTracks/_global';
import { drawRotationImage, lineLen } from './_base';
import { NoteIcon } from '../resourceReaders/noteIconReader';

export const drawNote = (ctx: CanvasRenderingContext2D, ctx_slideTrack: CanvasRenderingContext2D, note: Note, isEach: boolean = false, props: ShowingNoteProps) => {
  let θ = 0,
    x = 0,
    y = 0,
    tx = 0,
    ty = 0;

  const firstWord = note.pos.substring(0, 1);
  if (!isNaN(Number(firstWord))) {
    // 数字开头的位置
    θ = (-5 / 8 + (1 / 4) * Number(note.pos)) * Math.PI;
    x = center[0] + (props.rho + maimaiSummonLineR) * Math.cos(θ);
    y = center[1] + (props.rho + maimaiSummonLineR) * Math.sin(θ);
  } else {
    // 字母开头的位置（TOUCH）
    const touchPos = note.pos.substring(1, 2);
    switch (firstWord) {
      case 'C':
        x = center[0];
        y = center[1];
        break;
      case 'A':
        θ = (-5 / 8 + (1 / 4) * Number(touchPos)) * Math.PI;
        if (note.type === NoteType.Touch) {
          x = center[0] + maimaiADTouchR * Math.cos(θ);
          y = center[1] + maimaiADTouchR * Math.sin(θ);
        } else {
          x = center[0] + maimaiScreenR * Math.cos(θ);
          y = center[1] + maimaiScreenR * Math.sin(θ);
        }
        break;
      case 'B':
        θ = (-5 / 8 + (1 / 4) * Number(touchPos)) * Math.PI;
        x = center[0] + maimaiBR * Math.cos(θ);
        y = center[1] + maimaiBR * Math.sin(θ);
        break;
      case 'D':
        θ = (-3 / 4 + (1 / 4) * Number(touchPos)) * Math.PI;
        if (note.type === NoteType.Touch) {
          x = center[0] + maimaiADTouchR * Math.cos(θ);
          y = center[1] + maimaiADTouchR * Math.sin(θ);
        } else {
          x = center[0] + maimaiScreenR * Math.cos(θ);
          y = center[1] + maimaiScreenR * Math.sin(θ);
        }
        break;
      case 'E':
        θ = (-3 / 4 + (1 / 4) * Number(touchPos)) * Math.PI;
        x = center[0] + maimaiER * Math.cos(θ);
        y = center[1] + maimaiER * Math.sin(θ);
        break;
      default:
        break;
    }
  }

  if (note.type === NoteType.Hold) {
    tx = center[0] + (props.tailRho + maimaiSummonLineR) * Math.cos(θ);
    ty = center[1] + (props.tailRho + maimaiSummonLineR) * Math.sin(θ);
  }

  //console.log(props, ty )

  // // 画
  // ctx.beginPath();
  // ctx.arc(x, y, maimaiTapR, 0, 2 * Math.PI);

  let k = 0.8;

  const drawTapImage = (image: HTMLImageElement) => {
    const centerx = x,
      centery = y;
    drawRotationImage(ctx, image, x - props.radius / k, y - props.radius / k, (props.radius * 2) / k, (props.radius * 2) / k, centerx, centery, -22.5 + Number(note.pos) * 45);
  };

  const drawSlideTapImage = (image: HTMLImageElement, rotate: boolean = true) => {
    const centerx = x,
      centery = y;
    drawRotationImage(
      ctx,
      image,
      x - props.radius / k,
      y - props.radius / k,
      (props.radius * 2) / k,
      (props.radius * 2) / k,
      centerx,
      centery,
      -22.5 + Number(note.pos) * 45 + (rotate ? (props.timer * 50000) / note.slideTracks![0]!.remainTime! : 0)
    );
  };

  const drawHoldImage = (image: HTMLImageElement, shortHoldImage?: HTMLImageElement, isShortHold: boolean = false) => {
    //console.log(y, ty);
    const centerx = x,
      centery = y;

    if (isShortHold) {
      drawRotationImage(ctx, shortHoldImage!, x - props.radius / k, y - props.radius / k, (props.radius * 2) / k, (props.radius * 1.1547 * 2) / k, centerx, centery, -22.5 + Number(note.pos) * 45);
    } else {
      if (props.status === 0) {
        drawRotationImage(
          ctx,
          shortHoldImage!,
          x - props.radius / k,
          y - (props.radius * 1.1547) / k,
          (props.radius * 2) / k,
          (props.radius * 1.1547 * 2) / k,
          centerx,
          centery,
          -22.5 + Number(note.pos) * 45
        );
      } else {
        drawRotationImage(
          ctx,
          image,
          x - props.radius / k,
          y - (props.radius * 1.1547) / k,
          (props.radius * 2) / k,
          (props.radius * 1.2) / k,
          centerx,
          centery,
          -22.5 + Number(note.pos) * 45,
          1,
          0,
          0,
          image.width,
          holdHeadHeight
        );
        drawRotationImage(
          ctx,
          image,
          x - props.radius / k,
          y - props.radius / k + props.radius,
          (props.radius * 2) / k,
          props.rho - props.tailRho,
          centerx,
          centery,
          -22.5 + Number(note.pos) * 45,
          1,
          0,
          holdHeadHeight,
          image.width,
          image.height - 2 * holdHeadHeight
        );
        drawRotationImage(
          ctx,
          image,
          tx - props.radius / k,
          ty - props.radius / k,
          (props.radius * 2) / k,
          (props.radius * 1.2) / k,
          tx,
          ty,
          157.5 + Number(note.pos) * 45,
          1,
          0,
          0,
          image.width,
          holdHeadHeight
        );
      }
    }
  };

  const drawTouchImage = (image: HTMLImageElement, imageCenter: HTMLImageElement) => {
    const centerx = x,
      centery = y;
    const k = 0.5,
      centerk = 0.6;
    for (let i = 0; i < 4; i++) {
      drawRotationImage(ctx, image, x - (image.width * k) / 2, y + touchMaxDistance - 6 - props.rho, image.width * k, image.height * k, x, y, 90 * i, props.radius / maimaiTapR);
    }
    drawRotationImage(ctx, imageCenter, x - (imageCenter.width * centerk) / 2, y - (imageCenter.height * centerk) / 2, imageCenter.width * centerk, imageCenter.height * centerk);
  };

  const drawTouchHoldImage = (isShortHold: boolean = false) => {
    const centerx = x,
      centery = y;

    const k = 0.5,
      centerk = 0.6;

    const touchHoldPieces = [NoteIcon.touch_hold_1, NoteIcon.touch_hold_2, NoteIcon.touch_hold_3, NoteIcon.touch_hold_4];
    if (isShortHold) {
      for (let i = 0; i < 4; i++) {
        drawRotationImage(
          ctx,
          touchHoldPieces[i],
          x - (touchHoldPieces[i].width * k) / 2,
          y + touchMaxDistance - 6 - props.rho,
          touchHoldPieces[i].width * k,
          touchHoldPieces[i].height * k,
          x,
          y,
          135 + 90 * i,
          props.radius / maimaiTapR
        );
      }
      drawRotationImage(
        ctx,
        NoteIcon.touch_center,
        x - (NoteIcon.touch_center.width * centerk) / 2,
        y - (NoteIcon.touch_center.height * centerk) / 2,
        NoteIcon.touch_center.width * centerk,
        NoteIcon.touch_center.height * centerk
      );
    } else {
      if (props.status === 0 || props.status === 1) {
        for (let i = 0; i < 4; i++) {
          drawRotationImage(
            ctx,
            touchHoldPieces[i],
            x - (touchHoldPieces[i].width * k) / 2,
            y + touchMaxDistance - 6 - props.rho,
            touchHoldPieces[i].width * k,
            touchHoldPieces[i].height * k,
            x,
            y,
            135 + 90 * i,
            props.radius / maimaiTapR
          );
        }
        drawRotationImage(
          ctx,
          NoteIcon.touch_center,
          x - (NoteIcon.touch_center.width * centerk) / 2,
          y - (NoteIcon.touch_center.height * centerk) / 2,
          NoteIcon.touch_center.width * centerk,
          NoteIcon.touch_center.height * centerk
        );
      } else if (props.status === 2) {
        for (let i = 0; i < 4; i++) {
          drawRotationImage(
            ctx,
            touchHoldPieces[i],
            x - (touchHoldPieces[i].width * k) / 2,
            y + touchMaxDistance - 6 - props.rho,
            touchHoldPieces[i].width * k,
            touchHoldPieces[i].height * k,
            x,
            y,
            135 + 90 * i,
            props.radius / maimaiTapR
          );
        }
        drawRotationImage(
          ctx,
          NoteIcon.touch_center,
          x - (NoteIcon.touch_center.width * centerk) / 2,
          y - (NoteIcon.touch_center.height * centerk) / 2,
          NoteIcon.touch_center.width * centerk,
          NoteIcon.touch_center.height * centerk
        );

        const cutCircleR = NoteIcon.touch_hold_gage.width * centerk;
        ctx.save();

        ctx.beginPath();
        ctx.moveTo(x, y - cutCircleR);
        ctx.lineTo(x, y);

        tx = x + cutCircleR * Math.cos(props.tailRho);
        ty = y + cutCircleR * Math.sin(props.tailRho);

        ctx.lineTo(tx, ty);

        if (props.tailRho >= 1.5 * Math.PI && props.tailRho <= 2 * Math.PI) {
          ctx.lineTo(x - cutCircleR, y - cutCircleR);
        }
        if (props.tailRho >= Math.PI && props.tailRho <= 2 * Math.PI) {
          ctx.lineTo(x - cutCircleR, y + cutCircleR);
        }
        if (props.tailRho >= 0.5 * Math.PI && props.tailRho <= 2 * Math.PI) {
          ctx.lineTo(x + cutCircleR, y + cutCircleR);
        }
        if (props.tailRho >= 0 && props.tailRho <= 2 * Math.PI) {
          ctx.lineTo(x + cutCircleR, y - cutCircleR);
        }

        ctx.lineTo(x, y - cutCircleR);
        ctx.closePath();
        ctx.clip();

        drawRotationImage(
          ctx,
          NoteIcon.touch_hold_gage,
          x - (NoteIcon.touch_hold_gage.width * centerk) / 2,
          y - (NoteIcon.touch_hold_gage.height * centerk) / 2,
          NoteIcon.touch_hold_gage.width * centerk,
          NoteIcon.touch_hold_gage.height * centerk
        );
        ctx.restore();
      }
    }
  };

  const drawSlideTrackImage = (imageTrack: HTMLImageElement, imageStar: HTMLImageElement, wifiTrack?: HTMLImageElement[]) => {
    if (note.slideType !== 'w') {
      // 间隔放置TRACK元素的时间
      const trackItemGapTime = (trackItemGap * note.remainTime!) / trackLength(note.slideType!, Number(note.pos), Number(note.endPos), note.turnPos === undefined ? undefined : Number(note.turnPos));

      // SLIDE TRACK
      ctx_slideTrack.save();
      ctx_slideTrack.translate(center[0], center[1]);
      ctx_slideTrack.rotate(((Number(note.pos) - 1) * 22.5 * π) / 90);
      // 得从後往前画
      for (let i = note.remainTime!; i >= 0; i -= trackItemGapTime) {
        const slideData = getTrackProps(note.slideType!, Number(note.pos), Number(note.endPos), i, note.remainTime!, note.turnPos === undefined ? undefined : Number(note.turnPos)) as {
          x: number;
          y: number;
          direction: number;
        };
        drawRotationImage(
          ctx_slideTrack,
          imageTrack,
          slideData.x - trackItemWidth / 2 - center[0],
          slideData.y - trackItemHeight / 2 - center[1],
          trackItemWidth,
          trackItemHeight,
          slideData.x - center[0],
          slideData.y - center[1],
          slideData.direction,
          props.radius
        );
      }
      ctx_slideTrack.restore();

      // GUIDE STAR
      ctx.save();
      ctx.translate(center[0], center[1]);
      ctx.rotate(((Number(note.pos) - 1) * 22.5 * π) / 90);

      const guideStarData = getTrackProps(note.slideType!, Number(note.pos), Number(note.endPos), props.rho, note.remainTime!, note.turnPos === undefined ? undefined : Number(note.turnPos)) as {
        x: number;
        y: number;
        direction: number;
      };
      drawRotationImage(
        ctx,
        imageStar,
        guideStarData.x - props.guideStarRadius! * 2 - center[0],
        guideStarData.y - props.guideStarRadius! * 2 - center[1],
        props.guideStarRadius! * 4,
        props.guideStarRadius! * 4,
        guideStarData.x - center[0],
        guideStarData.y - center[1],
        guideStarData.direction,
        props.guideStarRadius! / maimaiTapR
      );
      ctx.restore();
    } else {
      // WIFI TRACK

      // WIFI TRACK开始于screenR而不是judgeR
      const startPoint = [center[0] + maimaiScreenR * cos((-5 / 8 + 1 / 4) * Math.PI), center[1] + maimaiScreenR * sin((-5 / 8 + 1 / 4) * Math.PI)];
      const getWifiTrackProps = (ct: number, rt: number): { x: number; y: number; direction: number }[] => {
        return [
          {
            x: startPoint[0] + (APositions[5][0] - startPoint[0]) * (ct / rt),
            y: startPoint[1] + (APositions[5][1] - startPoint[1]) * (ct / rt),
            direction: 22.5 * 5 + 202.5,
          },
          {
            x: startPoint[0] + (APositions[4][0] - startPoint[0]) * (ct / rt),
            y: startPoint[1] + (APositions[4][1] - startPoint[1]) * (ct / rt),
            direction: 22.5 * 4 + 202.5,
          },
          {
            x: 2 * APositions[0][0] - startPoint[0] + (APositions[3][0] - 2 * APositions[0][0] + startPoint[0]) * (ct / rt),
            y: startPoint[1] + (APositions[3][1] - startPoint[1]) * (ct / rt),
            direction: 22.5 * 3 + 202.5,
          },
        ];
      };

      // 相邻两判定点的距离
      const dist = lineLen(APositions[4][0], APositions[4][1], APositions[5][0], APositions[5][1]);

      // SLIDE TRACK
      ctx_slideTrack.save();
      ctx_slideTrack.translate(center[0], center[1]);
      ctx_slideTrack.rotate(((Number(note.pos) - 1) * 22.5 * π) / 90);
      // 得从後往前画

      for (let i = 11; i >= 1; i--) {
        const ct = (note.remainTime! * i) / 12;

        const slideData = getWifiTrackProps(ct, note.remainTime!);

        drawRotationImage(
          ctx_slideTrack,
          wifiTrack![i - 1],
          slideData[0].x - center[0] - ((dist * i) / 12) * 0.076,
          slideData[0].y - center[1] - (((wifiTrack![i - 1].height / wifiTrack![i - 1].width) * (dist * i)) / 12) * 0.076,
          (dist * i) / 12,
          ((wifiTrack![i - 1].height / wifiTrack![i - 1].width) * (dist * i)) / 12,
          slideData[0].x - center[0],
          slideData[0].y - center[1],
          22.534119524645373,
          props.radius * 0.5
        );

        ctx_slideTrack.save();
        ctx_slideTrack.scale(-1, 1); //左右镜像翻转
        drawRotationImage(
          ctx_slideTrack,
          wifiTrack![i - 1],
          slideData[2].x - (APositions[0][0] - APositions[7][0]) - center[0] - ((dist * i) / 12) * 0.076,
          slideData[2].y - center[1] - (((wifiTrack![i - 1].height / wifiTrack![i - 1].width) * (dist * i)) / 12) * 0.076,
          (dist * i) / 12,
          ((wifiTrack![i - 1].height / wifiTrack![i - 1].width) * (dist * i)) / 12,
          slideData[2].x - (APositions[0][0] - APositions[7][0]) - center[0],
          slideData[2].y - center[1],
          -22.534119524645373,
          props.radius * 0.5
        );
        ctx_slideTrack.restore();
      }
      ctx_slideTrack.restore();

      // GUIDE STAR
      ctx.save();
      ctx.translate(center[0], center[1]);
      ctx.rotate(((Number(note.pos) - 1) * 22.5 * π) / 90);

      const guideStarData = getTrackProps(note.slideType!, Number(note.pos), Number(note.endPos), props.rho, note.remainTime!, note.turnPos === undefined ? undefined : Number(note.turnPos)) as {
        x: number;
        y: number;
        direction: number;
      }[];
      guideStarData.forEach((wifiguide) => {
        drawRotationImage(
          ctx,
          imageStar,
          wifiguide.x - props.guideStarRadius! * 2 - center[0],
          wifiguide.y - props.guideStarRadius! * 2 - center[1],
          props.guideStarRadius! * 4,
          props.guideStarRadius! * 4,
          wifiguide.x - center[0],
          wifiguide.y - center[1],
          wifiguide.direction,
          props.guideStarRadius! / maimaiTapR
        );
      });

      ctx.restore();
    }
  };

  switch (note.type) {
    case NoteType.Tap:
      if (isEach) {
        if (note.isBreak) {
          drawTapImage(NoteIcon.tap_break);
        } else {
          drawTapImage(NoteIcon.tap_each);
        }
      } else {
        if (note.isBreak) {
          drawTapImage(NoteIcon.tap_break);
        } else {
          drawTapImage(NoteIcon.tap);
        }
      }
      if (note.isEx) {
        drawTapImage(NoteIcon.tap_ex);
      }
      break;
    case NoteType.Hold:
      if (isEach) {
        drawHoldImage(NoteIcon.hold_each, NoteIcon.short_hold_each, note.isShortHold);
      } else {
        drawHoldImage(NoteIcon.hold, NoteIcon.short_hold, note.isShortHold);
      }

      if (note.isEx) {
        drawHoldImage(NoteIcon.hold_ex, NoteIcon.short_hold_ex, note.isShortHold);
      }
      break;
    case NoteType.Slide:
      // console.log(note, note.slideTracks)
      if (note.slideTracks?.length! > 1) {
        // DOUBLE TRACK
        if (isEach) {
          if (note.isBreak) {
            drawTapImage(NoteIcon.star_break_double);
          } else {
            drawTapImage(NoteIcon.star_each_double);
          }
        } else {
          if (note.isBreak) {
            drawSlideTapImage(NoteIcon.star_break_double);
          } else {
            drawSlideTapImage(NoteIcon.star_double);
          }
        }
        if (note.isEx) {
          drawSlideTapImage(NoteIcon.star_ex_double);
        }
      } else {
        // SINGLE
        if (isEach) {
          if (note.isBreak) {
            drawSlideTapImage(NoteIcon.star_break);
          } else {
            drawSlideTapImage(NoteIcon.star_each);
          }
        } else {
          if (note.isBreak) {
            drawSlideTapImage(NoteIcon.star_break);
          } else {
            drawSlideTapImage(NoteIcon.star);
          }
        }
        if (note.isEx) {
          drawSlideTapImage(NoteIcon.star_ex);
        }
      }
      break;
    case NoteType.Touch:
      if (isEach) {
        drawTouchImage(NoteIcon.touch_each, NoteIcon.touch_each_center);
      } else {
        drawTouchImage(NoteIcon.touch, NoteIcon.touch_center);
      }
      break;
    case NoteType.TouchHold:
      drawTouchHoldImage(note.isShortHold);
      break;
    case NoteType.SlideTrack:
      if (isEach) {
        if (note.isBreak) {
          drawSlideTrackImage(NoteIcon.slide_each, NoteIcon.star_each, [
            NoteIcon.wifi_break_0,
            NoteIcon.wifi_break_1,
            NoteIcon.wifi_break_2,
            NoteIcon.wifi_break_3,
            NoteIcon.wifi_break_4,
            NoteIcon.wifi_break_5,
            NoteIcon.wifi_break_6,
            NoteIcon.wifi_break_7,
            NoteIcon.wifi_break_8,
            NoteIcon.wifi_break_9,
            NoteIcon.wifi_break_10,
          ]);
        } else {
          drawSlideTrackImage(NoteIcon.slide_each, NoteIcon.star_each, [
            NoteIcon.wifi_each_0,
            NoteIcon.wifi_each_1,
            NoteIcon.wifi_each_2,
            NoteIcon.wifi_each_3,
            NoteIcon.wifi_each_4,
            NoteIcon.wifi_each_5,
            NoteIcon.wifi_each_6,
            NoteIcon.wifi_each_7,
            NoteIcon.wifi_each_8,
            NoteIcon.wifi_each_9,
            NoteIcon.wifi_each_10,
          ]);
        }
      } else {
        if (note.isBreak) {
          drawSlideTrackImage(NoteIcon.slide, NoteIcon.star, [
            NoteIcon.wifi_break_0,
            NoteIcon.wifi_break_1,
            NoteIcon.wifi_break_2,
            NoteIcon.wifi_break_3,
            NoteIcon.wifi_break_4,
            NoteIcon.wifi_break_5,
            NoteIcon.wifi_break_6,
            NoteIcon.wifi_break_7,
            NoteIcon.wifi_break_8,
            NoteIcon.wifi_break_9,
            NoteIcon.wifi_break_10,
          ]);
        } else {
          drawSlideTrackImage(NoteIcon.slide, NoteIcon.star, [
            NoteIcon.wifi_0,
            NoteIcon.wifi_1,
            NoteIcon.wifi_2,
            NoteIcon.wifi_3,
            NoteIcon.wifi_4,
            NoteIcon.wifi_5,
            NoteIcon.wifi_6,
            NoteIcon.wifi_7,
            NoteIcon.wifi_8,
            NoteIcon.wifi_9,
            NoteIcon.wifi_10,
          ]);
        }
      }
      break;
    case NoteType.EndMark:
      //finish();
      break;
  }
};
