import React, { useEffect, useState } from 'react';
import { finished } from 'stream';
import './App.css';
import { Beat, Note, NoteType, ReadMaimaiData, Sheet, Song } from './maireader';

import {
  hold,
  holdEach,
  holdEachShort,
  holdEx,
  holdExShort,
  holdHeadHeight,
  holdShort,
  judgeAreaImage,
  music,
  tap,
  tapBreak,
  tapDoubleSlide,
  tapDoubleSlideBreak,
  tapDoubleSlideEach,
  tapDoubleSlideEx,
  tapEach,
  tapEx,
  tapSlide,
  tapSlideBreak,
  tapSlideEach,
  tapSlideEx,
  touch,
  touchCenter,
  touchEach,
  touchEachCenter,
  touchHold1,
  touchHold2,
  touchHold3,
  touchHold4,
  touchHoldGage,
} from './resourceReader';

const sheetdata = `
&title=sweet little sister
&wholebpm=168
&lv_5=11
&seek=5
&wait=0
&track=track.mp3
&bg=bg.png
&inote_5=(190){4}
3h[4:14],,4,,4h[4:8],,5,,5h[4:6],,6,,6h[4:2],,4b,,
6h[4:14],,5,,5h[4:8],,4,,4h[4:6],,3,,3h[4:2],,5b,,

{8}
6,,,,2-8[8:1]/3-8[8:1]/4-8[8:1],,,,6,,6,6,2-8[8:1]/3-8[18:1]/4-8[8:1],,,,
6,,,,2-8[8:1]/3-8[8:1]/4-8[8:1],,,,,6,,6,2-8[8:1]/3-8[8:1]/4-8[8:1],6,432,,

3,,,,5-1[8:1]/6-1[8:1]/7-1[8:1],,,3,,3,,3,5-1[8:1]/6-1[8:1]/7-1[8:1],,,,
3,,,,5-1[8:1]/6-1[8:1]/7-1[8:1],,3,,

{4}3>1[8:1]/4p8[8:1],,5q1[8:1]/6<8[8:1],,
{16}45,,34,56,34,56,34,56,3-8[8:1]/4-8[8:1],,,,7b,,,,

45,,2,4,3,,7,5,6,,2,4,3,,7,5,6,,2,4,3,,7,5,6b<1[8:1],,,,2,,,,
45,,7,8,7,,45,,45,,2,1,2,,45,,3456,,3456,,2367,,2367,,
1/2-4[8:1]*-5[8:1]/7-4[8:1]*-5[8:1]/8,,,,2b/7b,,,,

45,,7,5,6,,2,4,3,,7,5,6,,2,4,3,,56,,78,,12,,3b>8[8:1]/4b,,,,7,,7,,
{8}6,57,48,1h[8:2]/3,,8,26,35,,
3478,,1256,,1h[8:2]/4h[8:2]/5h[8:2]/8h[8:2],,,

{4}
5w1[8:1],5,4w8[8:1],4,5w1[8:1],1?w5[8:1],5?w1[8:1],,

{16}
45,,7,5,6,,47,,56,,2,4,3,,25,,
{4}3p7[8:1]*-8[8:1]/4-7[8:1]*q8[8:1],,
1-3[8:1]*-4[8:1]*-5[8:1]*-6[8:1]*-7[8:1],1b,

4w8[8:1],4,5w1[8:1],5,
{8}1256,1256,2367,2367,3-1[8:1]/4-1[8:1]/7-5[8:1]/8-5[8:1],,,,
2-4[8:1]*-5[8:1]/8-5[8:1]*-6[8:1],,28,,1-3[8:1]*-4[8:1]/7-4[8:1]*-5[8:1],,17,,
{32}1b$,2$,3$,4$,5$,6$,7$,8$,1b$,2$,3$,4$,5$,6$,7$,8$,{4}1b-5[8:1],,

{8}
37,1-5[8:1],,1>3[8:1]*<7[8:1],,1-4[8:1]*-5[8:1]*-6[8:1],,1,,4,5,6,78,1,78,6,
{16}7-4[8:1]*-5[8:1],8,7,8,7,,,,2-4[8:1]*-5[8:1],1,2,1,2,,,,
13,,,,68,,,,{32}3456,2,7,1,8,,,,,2b/7b,,,,,,,

{8}
26,8-4[8:1],,8>2[8:1]*<6[8:1],,8-3[8:1]*-4[8:1]*-5[8:1],,8,,
5,4,3,12,8,12,3,12,3,4,5,78,6,5,4,18,,,,45,,1b/2b/7b/8b,,

{8}
4/8<5[8:1],,4/8>3[8:1],,4/8-5[8:1],,4/8-3[8:1],,4/8V64[8:1],,4/8V24[8:1],,
58,6,7,8,
1-5[8:1]/2-4[8:1],,1-7[8:1]/2-6[8:1],,1-5[8:1]/2-4[8:1],,1-7[8:1]/2-6[8:1],,
12,,4,4,5,28,4,71,

1>4[8:1]/5,,1<6[8:1]/5,,1-4[8:1]/5,,1-6[8:1]/5,,1V35[8:1]/5,,1V75[8:1]/5,,
14,3,2,1,
78,6,45,3,12,3,45,6,1278,,,,45,,1b/2b/3b/6b/7b/8b,,

1>4[8:1]*-4[8:1]/5,,1<6[8:1]*-6[8:1]/5,,1>4[8:1]*-4[8:1]/5,,1<6[8:1]*-6[8:1]/5,,
1>4[8:1]*-4[8:1]/5,,1<6[8:1]*-6[8:1]/5,,14,3,2,1,

1-6[8:1]/2-6[8:1]/7<6[8:1]/8-6[8:1],,1-4[8:1]/2>4[8:1]/7v4[8:1]/8-4[8:1],,
1-6[8:1]/2-6[8:1]/7<6[8:1]/8-6[8:1],,1-4[8:1]/2>4[8:1]/7v4[8:1]/8-4[8:1],,
1278,,35,35,4,17,5,28,

4/8<5[8:1]*-5[8:1],,4/8>3[8:1]*-3[8:1],,4/8<5[8:1]*-5[8:1],,4/8>3[8:1]*-3[8:1],,
4/8<5[8:1]*-5[8:1],,4/8>3[8:1]*-3[8:1],,48,5,6,7,

{16}
8,1,7,2,8,1,7,2,{32}8,7,6,5,4,3,2,1,8,7,6,5,4,3,2,1,8b,,,,,,,,
{12}3,4,2,6,5,7,{32}56,12,7,3,8,4,1,5,{8}2b/6b,,

7,5,8h[8:2],,1h[8:2],,4h[1:1],,2,,3,,4,,3,,
2,4,1h[8:2],,8h[8:2],,5h[1:1],,7,,6,,5,,6,,
7,5,8h[8:2],,2h[8:2],,6h[8:2],,34,,3h[8:2],,56,,
6h[8:2]/7h[8:2],,45,,2h[8:2]/3h[8:2],,45,,
18,,1-5[8:1]/2-5[8:1]/7-4[8:1]/8-4[8:1],,1278,,,,3b/6b,,

2,4,1h[8:2],,8h[8:2],,5h[1:1]/6h[1:1],,7,,6,,5,,6,,
7,5,8h[8:2],,1h[8:2],,3h[1:1]/4h[1:1],,2,,3,,4,,3,,
2,4,1h[8:2],,7h[8:2],,5h[1:1]/6h[1:1],,6,,5,,6,,
7h[8:4]/8h[8:4],,1,,6,,18,18,,1,1,2,34,2,56,7,

{1}
4$/5w1[8:4]/5qq1[8:4]/5pp1[8:4],
{16}27,,4,5,4,,45,,67,,,,23,,,,
{1}4w8[8:4]/4qq8[8:4]/4pp8[8:4],
{16}27,,4,5,4,5,4,5,34,,,,8b,8b,8b,8b,

8b,,,57,,,2/4h[8:3]/5h[8:3],,,,1b,,1b,,,,
18,,,24,,,4h[8:3]/5h[8:3]/7,,,,8b,,8b,,,,
18,,,57,,,2/4h[8:3]/5h[8:3],,,,1b,,1b,,,,
18,,,23,,,457,,8b,,4b,5b,4b,5b,4b,5b,

{8}
4h[8:2],1,5h[8:2],8,4h[8:2],1,5h[8:2],8,
4h[8:2],18,5h[8:2],18,4h[8:2],18,5h[8:2],18,
48,48,37,37,26,26,15,15,

{16}
2,7,2,7,2,7,2,7,23,67,23,67,23,67,23,67,
1w5[8:22],1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
1,1,1,1,1,,,,1,1,1,1,1,,,,1,1,1,1,1-5[8:1],,,,{4}1b/2b/8b,,

{16}
18,,2,4,3,,7,5,6,,2,1,2,,7,8,7,,
2,1,4-2[8:1]*-1[8:1]*-6[8:1]*-7[8:1]*-8[8:1],,,,3b/4b/5b,,,,,,,,
{32}12,,,,,,,,6h[8:1]/8,7,6,5,,,,,78,,,,,,,,1/3h[8:1],2,3,4,,,,,
{8}18,27,36,45,
4>1[8:1]*-1[8:1]*-2[8:1]*-8[8:1]/5-1[8:1]*-7[8:1]*-8[8:1]*<8[8:1],,4b/5b,,

{16}
18,,2,4,3,,7,5,6,,2,1,2,,7,8,7,,2,1,4,,
7,8,5-1[8:1]*-2[8:1]*-3[8:1]*-7[8:1]*-8[8:1],,,,4b/5b/6b,,,,
18,,7,8,7,,2,1,2,,48,,37,,1/2/5h[32:26]/6h[32:26],,,,
{32}1,2,3,4,,,,,2,1,8,7,,,,,1,2,3,4,,,,,,,,,

{16}
12,,3,4,3,,6,5,6,,8,7,8,,1,2,1>4[8:1],,,,
{32}1<6[8:1],2,3,4,,,,,
1w5[8:1]*-5[8:1]*s5[8:1]*z5[8:1],8,7,6,,,,,1b,,,,,,,,,

1<5[8:1]/8,,,,,,,,1/6h[8:1]8,7,6,5,,,,1/8>4[8:1],,,,,,,,2h[8:1]/8,1,2,3,4,,,,
{8}18,27,36,45,
4>1[8:1]*-1[8:1]*-2[8:1]*-8[8:1]*w8[8:1]/5-1[8:1]*w1[8:1]*-7[8:1]*<8[8:1]*-8[8:1],,3b/4b/5b/6b,,

{16}
45,,2,4,3,,7,5,6,,1,4,3,,
{8}78,24,57,13,68,2b/3b/6b/7b,,1b/4b/5b/8b,,

{32}
1b,2,3,4,5h[8:3],,,,18,,,,18,,,,8b,7,6,5,4h[8:3],,,,18,,,,18,,,,
{16}1,8,2,7,1,8,3,6h[8:4],{32}1b,2,3,4,5,6,7,8,1b,2,3,4,5,6,7,8,

{8}
1b>8[4:5],,,,,,,,1<5[4:1],,,,,,,
{16}8z4[4:3],8,{8}8,{4},,,,

(47.5){32}
,2h[16:4]/6h[16:4]/2?-6[32:1],

{4},,,E

`;
enum GameState {
  Standby,
  Play,
  Stop,
  Finish,
}

let timer1: string | number | NodeJS.Timer | undefined, timer2: string | number | NodeJS.Timeout | undefined, timer3: string | number | NodeJS.Timer | undefined;

const canvasWidth = 700;
const canvasHeight = 700;

const center = [canvasWidth / 2, canvasHeight / 2];

const maimaiR = 350;
const maimaiScreenR = maimaiR * 0.8;
const maimaiJudgeLineR = maimaiScreenR * 0.885;
const maimaiSummonLineR = maimaiScreenR * 0.22;
const maimaiTapR = (maimaiScreenR / 9) * 0.8;
const maimaiBR = maimaiScreenR * 0.418;
const maimaiER = maimaiScreenR * 0.574;

const touchMaxDistance = maimaiTapR * 0.8;

const timerPeriod: number = 15;

let tapMoveSpeed: number = 1;
let tapEmergeSpeed: number = 0.2;

let speed: number = 10;

let starttime: number = 0;
let currentTime: number = 0;

let currentDifficulty = 5;

/** 提前绘制了的时间 */
let advancedTime = 0;

const drawBackground = () => {
  const el: HTMLCanvasElement = document.getElementsByClassName('canvasMain')[0] as HTMLCanvasElement;
  const ctx: CanvasRenderingContext2D = el.getContext('2d') as CanvasRenderingContext2D;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx.beginPath();
  ctx.arc(center[0], center[1], maimaiScreenR, 0, 2 * Math.PI);
  ctx.fillStyle = '#000';
  ctx.fill();
  ctx.strokeStyle = 'gray';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(center[0], center[1], maimaiJudgeLineR, 0, 2 * Math.PI);
  ctx.strokeStyle = 'white';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(center[0], center[1], maimaiSummonLineR, 0, 2 * Math.PI);
  ctx.strokeStyle = '#333333';
  ctx.stroke();

  const ρ = maimaiJudgeLineR;
  const θ = -1 / 8;

  const judgeDotWidth = 5;

  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.arc(center[0] + ρ * Math.cos((θ + i / 4) * Math.PI), center[1] + ρ * Math.sin((θ + i / 4) * Math.PI), judgeDotWidth, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }

  const k = 1.02;
  ctx.drawImage(judgeAreaImage, center[0] - maimaiJudgeLineR * k, center[1] - maimaiJudgeLineR * k, maimaiJudgeLineR * k * 2, maimaiJudgeLineR * k * 2);
};

const drawOver = () => {
  const el: HTMLCanvasElement = document.getElementsByClassName('canvasOver')[0] as HTMLCanvasElement;
  const ctx: CanvasRenderingContext2D = el.getContext('2d') as CanvasRenderingContext2D;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx.beginPath();
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.beginPath();
  ctx.arc(center[0], center[1], maimaiR, 0, 2 * Math.PI);
  ctx.fillStyle = 'lightgray';
  ctx.fill();
  ctx.strokeStyle = 'gray';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(center[0], center[1], maimaiScreenR, 0, 2 * Math.PI);
  ctx.strokeStyle = 'gray';
  ctx.stroke();

  clearArcFun(center[0], center[1], maimaiScreenR, ctx);
};

const starttimer = () => {
  readSheet();
  advancedTime = (currentSheet.notes[0].emergeTime ?? 0) < 0 ? -(currentSheet.notes[0].emergeTime ?? 0) : 0;
  starttime = performance.now();

  //console.log(sheet.beats5?.beat);
  timer1 = setInterval(reader, timerPeriod);
  //timer2 = setInterval(updater, timerPeriod);
  timer3 = setInterval(drawer, timerPeriod);
};

const finish = () => {
  clearInterval(timer1);
  clearInterval(timer3);
};

let songdata: Song;

let currentSheet: Sheet;

/** 在判定线停留的时间 */
let judgeLineRemainTime: number = 100;

/** 初始化谱面 */
const readSheet = () => {
  songdata = ReadMaimaiData(sheetdata);

  currentSheet = songdata.sheets[0];
  currentSheet.notes = calculate_emerge_move_time_of_notes(currentSheet.notes);
};

/** 为Notes计算浮现的时机 */
const calculate_emerge_move_time_of_notes = (notesOri: Note[]) => {
  const notes = notesOri;
  notes.forEach((note: Note, i: number) => {
    const emergingTime = maimaiTapR / ((tapEmergeSpeed * speed) / timerPeriod);
    const movingTime = (maimaiJudgeLineR - maimaiSummonLineR) / ((tapMoveSpeed * speed) / timerPeriod);
    notes[i].moveTime = notes[i].time - movingTime;
    notes[i].emergeTime = notes[i].time - movingTime - emergingTime;
  });

  return notes;
};

interface ShowingNoteProps {
  /** 所在的Beat的index */
  beatIndex: number;
  /** 在所有Notes中的index */
  noteIndex: number;

  /**
   * TAP:
   * -2: stop at judge line -1: die 0: emerge 1:move
   * HOLD:
   * -2: stop at judge line -1: die 0: emerge 1: grow 2: move 3: disappear 4: fill(充满 长度暂时不改变)
   */
  status: number;
  radius: number;
  // 位置
  rho: number;

  // 从生成到消亡的不间断变化量
  timer: number;

  tailRho: number;
  placeTime: number;

  isEach: boolean;
}

let showingNotes: ShowingNoteProps[] = [];

// 下一个note标号
let nextNoteIndex = 0;

/**
 * TOUCH叶片闭合时的当前位置
 * @param c currentTime
 * @param m moveTime
 * @param t time
 * @returns
 */
const touchConvergeCurrentRho = (c: number, m: number, t: number) => {
  return (touchMaxDistance * c * (c - m)) / (t * (t - m));
};

const reader = async () => {
  currentTime = performance.now() - starttime - advancedTime;

  //updater

  showingNotes = showingNotes.map((note) => {
    const newNote = note;
    const type = currentSheet.notes[note.noteIndex].type;

    switch (type) {
      case NoteType.Tap:
        if (newNote.status === 0) {
          // emerge
          newNote.radius =
            ((currentTime - currentSheet.notes[note.noteIndex].emergeTime!) / (currentSheet.notes[note.noteIndex].moveTime! - currentSheet.notes[note.noteIndex].emergeTime!)) * maimaiTapR;

          if (currentTime >= currentSheet.notes[note.noteIndex].moveTime!) {
            newNote.status = 1;
          }
        } else if (newNote.status === 1) {
          // move
          newNote.rho =
            ((currentTime - currentSheet.notes[note.noteIndex].moveTime!) / (currentSheet.notes[note.noteIndex].time! - currentSheet.notes[note.noteIndex].moveTime!)) *
            (maimaiJudgeLineR - maimaiSummonLineR);

          if (newNote.rho > maimaiScreenR + maimaiTapR) {
            newNote.status = -2;
          }
        }
        break;
      case NoteType.Hold:
        if (newNote.status === 0) {
          //emerge
          newNote.radius =
            ((currentTime - currentSheet.notes[note.noteIndex].emergeTime!) / (currentSheet.notes[note.noteIndex].moveTime! - currentSheet.notes[note.noteIndex].emergeTime!)) * maimaiTapR;

          if (currentTime >= currentSheet.notes[note.noteIndex].moveTime!) {
            newNote.status = 1;
          }
        } else if (newNote.status === 1) {
          // grow
          newNote.rho =
            ((currentTime - currentSheet.notes[note.noteIndex].moveTime!) / (currentSheet.notes[note.noteIndex].time! - currentSheet.notes[note.noteIndex].moveTime!)) *
            (maimaiJudgeLineR - maimaiSummonLineR);

          if (currentTime >= currentSheet.notes[note.noteIndex].time!) {
            newNote.status = 2;
          }
          if (currentTime >= currentSheet.notes[note.noteIndex].remainTime! + currentSheet.notes[note.noteIndex].moveTime!) {
            newNote.status = 2;
          }
        } else if (newNote.status === 2) {
          // move
          if (currentSheet.notes[note.noteIndex].time! < currentSheet.notes[note.noteIndex].moveTime! + currentSheet.notes[note.noteIndex].remainTime!) {
            // HOLD长度大于maimaiJudgeLine-maimaiSummonLine
            if (currentTime >= currentSheet.notes[note.noteIndex].moveTime! + currentSheet.notes[note.noteIndex].remainTime!) {
              newNote.status = 3;
            }
          } else {
            // HOLD长度小于maimaiJudgeLine-maimaiSummonLine

            newNote.tailRho =
              ((currentTime - currentSheet.notes[note.noteIndex].moveTime! - currentSheet.notes[note.noteIndex].remainTime!) /
                (currentSheet.notes[note.noteIndex].time! - currentSheet.notes[note.noteIndex].moveTime!)) *
              (maimaiJudgeLineR - maimaiSummonLineR);

            newNote.rho =
              ((currentTime - currentSheet.notes[note.noteIndex].moveTime!) / (currentSheet.notes[note.noteIndex].time! - currentSheet.notes[note.noteIndex].moveTime!)) *
              (maimaiJudgeLineR - maimaiSummonLineR);

            if (currentTime >= currentSheet.notes[note.noteIndex].time!) {
              if (currentSheet.notes[note.noteIndex].isShortHold) {
                newNote.status = -2;
              } else {
                newNote.status = 3;
              }
            }
          }
        } else if (newNote.status === 3) {
          // die
          newNote.tailRho =
            ((currentTime - currentSheet.notes[note.noteIndex].moveTime! - currentSheet.notes[note.noteIndex].remainTime!) /
              (currentSheet.notes[note.noteIndex].time! - currentSheet.notes[note.noteIndex].moveTime!)) *
            (maimaiJudgeLineR - maimaiSummonLineR);

          if (currentTime >= currentSheet.notes[note.noteIndex].time! + currentSheet.notes[note.noteIndex].remainTime!) {
            newNote.status = -1;
          }
        } else if (newNote.status === -2) {
          // stop
          if (currentTime >= currentSheet.notes[note.noteIndex].time! + judgeLineRemainTime) {
            newNote.status = -1;
          }
        }
        newNote.timer++;
        break;
      case NoteType.TouchHold:
        if (newNote.status === 0) {
          //emerge
          newNote.radius =
            ((currentTime - currentSheet.notes[note.noteIndex].emergeTime!) / (currentSheet.notes[note.noteIndex].moveTime! - currentSheet.notes[note.noteIndex].emergeTime!)) * maimaiTapR;

          if (currentTime > currentSheet.notes[note.noteIndex].moveTime!) {
            newNote.status = 1;
          }
        } else if (newNote.status === 1) {
          // converge
          newNote.rho = touchConvergeCurrentRho(currentTime, currentSheet.notes[note.noteIndex].moveTime!, currentSheet.notes[note.noteIndex].time!);

          if (currentTime >= currentSheet.notes[note.noteIndex].time!) {
            if (currentSheet.notes[note.noteIndex].isShortHold) {
              newNote.status = -2;
            } else {
              newNote.status = 2;
            }
          }
        } else if (newNote.status === 2) {
          // save
          newNote.tailRho = ((currentTime - currentSheet.notes[note.noteIndex].time!) / currentSheet.notes[note.noteIndex].remainTime!) * 2 * Math.PI;

          if (currentTime >= currentSheet.notes[note.noteIndex].time! + currentSheet.notes[note.noteIndex].remainTime!) {
            newNote.status = -2;
          }
        } else if (newNote.status === -2) {
          // stop
          if (currentTime >= currentSheet.notes[note.noteIndex].time! + (currentSheet.notes[note.noteIndex].remainTime! ?? 0) + judgeLineRemainTime) {
            newNote.status = -1;
          }
        }
        newNote.timer++;
        break;
      case NoteType.Touch:
        if (newNote.status === 0) {
          // emerge
          newNote.radius =
            ((currentTime - currentSheet.notes[note.noteIndex].emergeTime!) / (currentSheet.notes[note.noteIndex].moveTime! - currentSheet.notes[note.noteIndex].emergeTime!)) * maimaiTapR;

          if (currentTime >= currentSheet.notes[note.noteIndex].moveTime!) {
            newNote.status = 1;
          }
        } else if (newNote.status === 1) {
          // converge
          newNote.rho = touchConvergeCurrentRho(currentTime, currentSheet.notes[note.noteIndex].moveTime!, currentSheet.notes[note.noteIndex].time!);

          if (currentTime >= currentSheet.notes[note.noteIndex].time!) {
            newNote.status = -2;
          }
        } else if (newNote.status === -2) {
          // stop
          newNote.rho = touchMaxDistance;
          if (currentTime >= currentSheet.notes[note.noteIndex].time! + judgeLineRemainTime) {
            newNote.status = -1;
          }
        }
        newNote.timer++;
        break;
      default:
        if (newNote.status === 0) {
          // emerge
          newNote.radius =
            ((currentTime - currentSheet.notes[note.noteIndex].emergeTime!) / (currentSheet.notes[note.noteIndex].moveTime! - currentSheet.notes[note.noteIndex].emergeTime!)) * maimaiTapR;

          if (currentTime >= currentSheet.notes[note.noteIndex].moveTime!) {
            newNote.status = 1;
          }
        } else if (newNote.status === 1) {
          // move
          newNote.rho =
            ((currentTime - currentSheet.notes[note.noteIndex].moveTime!) / (currentSheet.notes[note.noteIndex].time! - currentSheet.notes[note.noteIndex].moveTime!)) *
            (maimaiJudgeLineR - maimaiSummonLineR);

          if (currentTime >= currentSheet.notes[note.noteIndex].time!) {
            newNote.status = -2;
          }
        } else if (newNote.status === -2) {
          // stop
          if (currentTime >= currentSheet.notes[note.noteIndex].time! + judgeLineRemainTime) {
            newNote.status = -1;
          }
        }
        newNote.timer++;
        break;
    }

    return newNote;
  });

  // 清除die掉的note
  showingNotes = showingNotes.filter((note) => {
    return note.status !== -1;
    // const type = currentSheet.notes[note.noteIndex].type;
    // if (type === NoteType.Hold) {
    //   return note.tailRho < maimaiScreenR - maimaiSummonLineR + maimaiTapR;
    // } else {
    //   return note.rho < maimaiScreenR - maimaiSummonLineR + maimaiTapR;
    // }
  });

  // reader
  while (currentTime >= currentSheet.notes[nextNoteIndex].emergeTime!) {
    showingNotes.push({
      beatIndex: currentSheet.notes[nextNoteIndex].beatIndex,
      noteIndex: nextNoteIndex,
      status: 0,
      radius: 0,
      rho: 0,
      tailRho: 0,
      timer: 0,
      placeTime: currentTime,
      isEach: currentSheet.notes[nextNoteIndex].isEach ?? false,
    });
    nextNoteIndex++;
  }

  //console.log(nextNoteIndex, showingNotes);
};

const drawer = async () => {
  const el: HTMLCanvasElement = document.getElementsByClassName('canvasFloat')[0] as HTMLCanvasElement;
  const ctx: CanvasRenderingContext2D = el.getContext('2d') as CanvasRenderingContext2D;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  //不用foreach是为了从里往外，这样外侧的才会绘制在内侧Note之上
  for (let i = showingNotes.length - 1; i >= 0; i--) {
    const note = showingNotes[i];
    drawNote(ctx, currentSheet.notes[note.noteIndex]!, note.isEach, note);
  }
};

const drawNote = (ctx: CanvasRenderingContext2D, note: Note, isEach: boolean = false, props: ShowingNoteProps) => {
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
        x = center[0] + maimaiScreenR * Math.cos(θ);
        y = center[1] + maimaiScreenR * Math.sin(θ);
        break;
      case 'B':
        θ = (-5 / 8 + (1 / 4) * Number(touchPos)) * Math.PI;
        x = center[0] + maimaiBR * Math.cos(θ);
        y = center[1] + maimaiBR * Math.sin(θ);
        break;
      case 'D':
        θ = (-3 / 4 + (1 / 4) * Number(touchPos)) * Math.PI;
        //console.log('D', -1 / 4 + (1 / 4) * Number(touchPos), touchPos);
        x = center[0] + maimaiScreenR * Math.cos(θ);
        y = center[1] + maimaiScreenR * Math.sin(θ);
        break;
      case 'E':
        θ = (-3 / 4 + (1 / 4) * Number(touchPos)) * Math.PI;
        //console.log('E', -1 / 4 + (1 / 4) * Number(touchPos), touchPos);
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
    const k = 0.4,
      centerk = 0.5;
    for (let i = 0; i < 4; i++) {
      drawRotationImage(ctx, image, x - (image.width * k) / 2, y + touchMaxDistance - 6 - props.rho, image.width * k, image.height * k, x, y, 90 * i, props.radius / maimaiTapR);
    }
    drawRotationImage(ctx, imageCenter, x - (imageCenter.width * centerk) / 2, y - (imageCenter.height * centerk) / 2, imageCenter.width * centerk, imageCenter.height * centerk);
  };

  const drawTouchHoldImage = (isShortHold: boolean = false) => {
    const centerx = x,
      centery = y;

    const k = 0.4,
      centerk = 0.5;

    const touchHoldPieces = [touchHold1, touchHold2, touchHold3, touchHold4];
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
      drawRotationImage(ctx, touchCenter, x - (touchCenter.width * centerk) / 2, y - (touchCenter.height * centerk) / 2, touchCenter.width * centerk, touchCenter.height * centerk);
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
        drawRotationImage(ctx, touchCenter, x - (touchCenter.width * centerk) / 2, y - (touchCenter.height * centerk) / 2, touchCenter.width * centerk, touchCenter.height * centerk);
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
        drawRotationImage(ctx, touchCenter, x - (touchCenter.width * centerk) / 2, y - (touchCenter.height * centerk) / 2, touchCenter.width * centerk, touchCenter.height * centerk);

        const cutCircleR = touchHoldGage.width * centerk;
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

        drawRotationImage(ctx, touchHoldGage, x - (touchHoldGage.width * centerk) / 2, y - (touchHoldGage.height * centerk) / 2, touchHoldGage.width * centerk, touchHoldGage.height * centerk);
        ctx.restore();
      }
    }
  };

  switch (note.type) {
    case NoteType.Tap:
      if (isEach) {
        if (note.isBreak) {
          drawTapImage(tapBreak);
        } else {
          drawTapImage(tapEach);
        }
      } else {
        if (note.isBreak) {
          drawTapImage(tapBreak);
        } else {
          drawTapImage(tap);
        }
      }
      if (note.isEx) {
        drawTapImage(tapEx);
      }
      break;
    case NoteType.Hold:
      if (isEach) {
        drawHoldImage(holdEach, holdEachShort, note.isShortHold);
      } else {
        drawHoldImage(hold, holdShort, note.isShortHold);
      }

      if (note.isEx) {
        drawHoldImage(holdEx, holdExShort, note.isShortHold);
      }
      break;
    case NoteType.Slide:
      // console.log(note, note.slideTracks)
      if (note.slideTracks?.length! > 1) {
        // DOUBLE TRACK
        if (isEach) {
          if (note.isBreak) {
            drawTapImage(tapDoubleSlideBreak);
          } else {
            drawTapImage(tapDoubleSlideEach);
          }
        } else {
          if (note.isBreak) {
            drawSlideTapImage(tapDoubleSlideBreak);
          } else {
            drawSlideTapImage(tapDoubleSlide);
          }
        }
        if (note.isEx) {
          drawSlideTapImage(tapDoubleSlideEx);
        }
      } else {
        // SINGLE
        if (isEach) {
          if (note.isBreak) {
            drawSlideTapImage(tapSlideBreak);
          } else {
            drawSlideTapImage(tapSlideEach);
          }
        } else {
          if (note.isBreak) {
            drawSlideTapImage(tapSlideBreak);
          } else {
            drawSlideTapImage(tapSlide);
          }
        }
        if (note.isEx) {
          drawSlideTapImage(tapSlideEx);
        }
      }
      break;
    case NoteType.Touch:
      if (isEach) {
        drawTouchImage(touchEach, touchEachCenter);
      } else {
        drawTouchImage(touch, touchCenter);
      }
      break;
    case NoteType.TouchHold:
      drawTouchHoldImage(note.isShortHold);
      break;
    case NoteType.EndMark:
      //finish();
      break;
  }
};

const drawSlide = () => {};

/**
 * 画图
 * @param ctx
 * @param image
 * @param x
 * @param y
 * @param w
 * @param h
 * @param centerX 旋转中心x
 * @param centerY 旋转中心y
 * @param r 旋转角度
 * @param alpha 透明 0-1
 * @param sx 剪切x
 * @param sy 剪切y
 * @param sw 剪切宽度
 * @param sh 剪切高度
 */
const drawRotationImage = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  centerX?: number,
  centerY?: number,
  r?: number,
  alpha?: number,
  sx?: number,
  sy?: number,
  sw?: number,
  sh?: number
) => {
  const TO_RADIANS = Math.PI / 180;
  if (centerX && centerY && r) {
    ctx.save(); //保存状态
    ctx.translate(centerX, centerY); //设置画布上的(0,0)位置，也就是旋转的中心点
    ctx.rotate(r * TO_RADIANS);
    ctx.globalAlpha = alpha ?? 1;
    ctx.drawImage(image, sx ?? 0, sy ?? 0, sw ?? image.width, sh ?? image.height, x - centerX, y - centerY, w, h);
    ctx.restore(); //恢复状态
  } else {
    ctx.globalAlpha = alpha ?? 1;
    ctx.drawImage(image, sx ?? 0, sy ?? 0, sw ?? image.width, sh ?? image.height, x, y, w, h);
  }
};

function clearArcFun(x: number, y: number, r: number, cxt: CanvasRenderingContext2D) {
  //(x,y)为要清除的圆的圆心，r为半径，cxt为context
  var stepClear = 1; //别忘记这一步
  clearArc(x, y, r);
  function clearArc(x: number, y: number, radius: number) {
    var calcWidth = radius - stepClear;
    var calcHeight = Math.sqrt(radius * radius - calcWidth * calcWidth);
    var posX = x - calcWidth;
    var posY = y - calcHeight;

    var widthX = 2 * calcWidth;
    var heightY = 2 * calcHeight;

    if (stepClear <= radius) {
      cxt.clearRect(posX, posY, widthX, heightY);
      stepClear += 1;
      clearArc(x, y, radius);
    }
  }
}

function App() {
  const [gameState, setGameState] = useState(GameState.Standby);

  useEffect(() => {
    drawBackground();
    drawOver();
  }, []);

  return (
    <div className="App">
      <div className="canvasContainer">
        <canvas className="canvasMain" height="700" width="700" />
        <canvas className="canvasFloat" height="700" width="700" />
        <canvas className="canvasOver" height="700" width="700" />
      </div>
      <div style={{ position: 'absolute', zIndex: 3 }}>
        <button
          onClick={() => {
            if (gameState === GameState.Standby) {
              starttimer();
              setGameState(GameState.Play);
            } else if (gameState === GameState.Play) {
              clearInterval(timer1);
              clearInterval(timer3);
              setGameState(GameState.Stop);
            } else if (gameState === GameState.Stop) {
              timer1 = setInterval(reader, timerPeriod);
              //timer2 = setInterval(updater, timerPeriod);
              timer3 = setInterval(drawer, timerPeriod);
              setGameState(GameState.Play);
            } else {
            }
          }}
        >
          {gameState === GameState.Play ? 'stop' : 'start'}
        </button>
        <button
          onClick={() => {
            const sheetdata = `
          &title=sweet little sister
&wholebpm=168
&lv_5=11
&seek=5
&wait=0
&track=track.mp3
&bg=bg.png
&inote_5= (168){4} 
1-5[8:1],,8-4[8:1],,2-5[8:1],,7-4[8:1], 
{8} 
,,,2,,2,,5,,5,,7,,7,,4,,4, 
{4} 
5-7[8:1],,4-2[8:1],,6-8[8:1],,3-1[8:1],, 
{8} 
8-6[8:1],,1-3[8:1],,7-5[8:1],,2-4[8:1],, 
8-4[8:1],,1-5[8:1],,,,,, 
1h[4:1],,2h[4:1],,3h[4:1],,4h[4:1],, 
5h[4:1],,6h[4:1],,7h[4:1],,8,, 
8h[4:1],,7h[4:1],,6h[4:1],,5h[4:1],,4h[4:1],,3h[4:1],,2h[4:1],,1,, 
1v2[8:1],,,,5v6[8:1],,,,3v4[8:1],,,,7v8[8:1],,,, 
1-5[8:1],,8-4[8:1],,2-6[8:1],,7-3[8:1],,1^4[8:1],,8^5[8:1],,1-5[8:1],,,, 
,,7-4[8:1],,1-3[8:1],,5h[4:3],,,,3,,3,, 
1h[4:1],,7h[8:3],,,5h[8:3],,,8,,,,8,,1,2,3,, 
,,8q5[8:1],,2,,1p4[8:1],,7 
,,8q6[8:1],,2,,1p3[8:1],,7 
,,,,,,12,,,,78,,1,8,27,, 
1-5[16:3],82,,,8-4[16:3],17,,, 
2-6[16:3],13,,,7-3[16:3],86,,, 
1-5[16:3],82,,,8-4[16:3],17,,, 
2-6[16:3],13,,,7-3[16:3],86,,, 
2-4[8:1],,1-4[8:1],,8-4[8:1],,7-4[8:1],, 
1-4[8:1],,7-4[8:1],,8-4[8:1],,,, 
{16}3,2,1,8,7,6,5,4,3,2,1,8,7,6,5,4, 
3h[4:3]{8},,,,7h[4:1],,,,15,,73,, 
8v6[8:1]/4v2[8:1],,,, 
8^3[8:1],7,6,,4^7[8:1],3,2,,4,8,6,2,8,1,27,, 
{16}6,,8,,1,,3,,24,,6,5,6,,57,, 
{8}45,45,34,34,56,,,, 
1-3[8:1],7,5,,8-6[8:1],2,4,,3,7,5,1,8,1,27,, 
{16}2h[4:2],,3,,4,,5,,7,,5,6,5,,4,, 
{8}5-1[8:1],,,,1b/2b,,7b/8b,, 
1^6[8:1],2,3,,5^2[8:1],6,7,,5,1,3,7,1,8,27,, 
{16}3,,1,,8,,6,,75,,3,4,3,,24,, 
{8}45,45,56,56,34,,,, 
2-6[8:1],8,4,,7-3[8:1],1,5,,2,4,7,5,3,6,18,, 
{16}3h[4:2],,2,,1,,8,,6,,8,7,8,,1,, 
{12}2b/7b,,,,,,,,,,,, 
3,4,3,6,5,6,3,4,3,6b/7b,,3b/4b,,1b/8b,, 
3,4,2,6,5,7,3,6,3,1b/8b,,6b/7b,,3b/4b,, 
2,4,3,7,5,6,2,7,2,6b/8b,,4b/5b,,1b/3b,, 
2,8,1,7,1,8,4,5,4,3b/7b,,1b/5b,,2b/6b,, 
{8}2h[4:3],,1,,3,,8h[4:4],,7,,1,,6,,3,, 
3h[4:3],,4,,2,,6h[4:3],,5,,7,,4h[4:1],,2,, 
8h[4:2],,7,,1h[4:2],,2,, 
8h[4:1],,6h[4:1],,4h[4:1],,2,, 
1h[4:1],,2h[4:1],,5h[4:1],,6h[4:1],, 
7h[4:1],,8h[4:1],,3h[4:1],,4,, 
2^4[8:1],,5,,6^8[8:1],,1,, 
1-5[8:1],,7,,7-4[8:1],,2,, 
5^7[8:1],,4,,3^1[8:1],,8,, 
2-6[8:1],,1-5[8:1],,8-4[8:1],,1,, 
1-5[16:3],,1/8-4[16:3],,8/2-5[16:3],,5,, 
7-4[16:3],,7/1-5[16:3],,1/8-4[16:3],,8,, 
1-3[16:3],,1/7-5[16:3],,7/4-8[16:3],,4,, 
37,, 
1z5[4:1],,,,,, 
3-7[8:1],,1,,5-1[8:1],,3,, 
2,2,8^3[8:1],7,6,,34,56,(175),1,5,3,7, 
{16} 
1,6,4,,8,, 
{8}2^5[4:1],,6,7,8^3[4:1],,4,, 
(176)2q7[8:1],,8,,6^3[8:1],,1,, 
8,1,8-4[8:1],1,8-5[8:1],,,7h[8:3], 
,5,2h[4:1],4,7, 
{16} 
1,8,1,,36,, 
{8} 
(177)7-5[8:1],,1-5[8:1],,8-5[8:1],,,, 
(181)2-6[8:1],1,8,7,(182)6^1[8:1],5,4,3 
(183),2,8,4,6,15,,37(184),4^7[8:1]/8 
,,3,2,1,82, 
{16}1,6,4,,35,, 
(185){8}45,45,34,34,56,,18,, 
(186)6^3[8:1],7,8,1,2q7[8:1],3,4,5, 
(187)6,5,4,3,18,,12,78, 
(188),7,5,3,17,1{16}8,3,5,,46,, 
(189){8}15,37,26,48,12,57,25,78, 
(190)2,,1,,8,,2>7[1:1]/5z1[1:1] 
{1},, 
E

          `;

            const res = ReadMaimaiData(sheetdata);
            console.log(res);
          }}
        >
          read
        </button>
      </div>
    </div>
  );
}

export default App;
