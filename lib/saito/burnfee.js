'use strict'

const Big = require('big.js')

/**
 * BurnFee Constructor
 */
class BurnFee {
  constructor() {
    // default values
    this.heartbeat     = 10;***REMOVED*** expect new block every 10 seconds

    // maximum heartbeat is 2x the heartbeat
    // see below in returnWorkNeeded
    return this;
  ***REMOVED***

  /**
   * 
   * @param {****REMOVED*** prevts 
   * @param {****REMOVED*** current_time 
   * @param {****REMOVED*** bf 
   */
  returnWorkNeeded(prevts=0, current_time=(new Date().getTime()), bf=0) {
    if (prevts == 0) { return 0; ***REMOVED***

    let elapsed_time = current_time - prevts;
    if (elapsed_time <= 1) { elapsed_time = 1; ***REMOVED***
    if (elapsed_time > (2 * 1000 * this.heartbeat)) { return 0; ***REMOVED***
    return Math.floor(bf / (elapsed_time/1000));
  ***REMOVED***

  /**
   * 
   * @param {****REMOVED*** prevblk 
   * @param {****REMOVED*** blk 
   */
  returnBurnFee(prevblk=null, blk=null) {
    if (prevblk == null || blk == null) { return 0; ***REMOVED***
    return Math.floor((prevblk.block.bf +1 ) * Math.sqrt((this.heartbeat * 1000)/(Math.abs(blk.block.ts - prevblk.block.ts) + 1)));
  ***REMOVED***

***REMOVED***

module.exports = BurnFee;
