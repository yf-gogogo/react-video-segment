import React,{Component} from 'react';
import './Video.css';
import FragmentVideo from './FragmentVideo';
import 'antd/dist/antd.css';
import { Slider, Button } from 'antd';


class Video extends Component{
    constructor(props){
        super(props);
        this.video = React.createRef()
        this.state = {
            //视频总长度
            dur:0,
            //播放器当前位置
            cur:0,
            //分割视频的起始位置
            cutstart:0,
            //分割视频的结束位置
            cutend:0
        }
        this.onCanPlay = this.onCanPlay.bind(this);
        this.onTimeUpdate = this.onTimeUpdate.bind(this);
        this.onChange = this.onChange.bind(this);
        this.formatter = this.formatter.bind(this);
        this.playFragment = this.playFragment.bind(this);
    }
    onCanPlay(e){
        console.log('onCaplay',this.video.current.duration)
        if(this.state.cur === 0){
            this.setState({
                // dur:(this.video.current.currentTime).toFixed(1)
                dur:this.video.current.duration,
                cutend:this.video.current.duration
            })
        }
        
    };
    onLoadedmetadata(e){

    }
    onTimeUpdate(e){
        console.log('onTimeUpdate')
        this.setState({
            // dur:(this.video.current.currentTime).toFixed(1)
            cur:this.video.current.currentTime
        })
        if(this.video.current.currentTime >= this.state.cutend){
            this.video.current.pause();
        }
    };
    //转换时间格式 xxxxms->xx:xx:xx
    secondToDate(stime) {
        var h = Math.floor(stime / 3600) < 10 ? '0'+Math.floor(stime / 3600) : Math.floor(stime / 3600);
        var m = Math.floor((stime / 60 % 60)) < 10 ? '0' + Math.floor((stime / 60 % 60)) : Math.floor((stime / 60 % 60));
        var s = Math.floor((stime % 60)) < 10 ? '0' + Math.floor((stime % 60)) : Math.floor((stime % 60));
        return h + ":" + m + ":" + s;
    }
    //滑动滑杆时
    onChange(value) {
        console.log('onChange: ', value);
        this.setState({
            cutstart:this.state.dur*value[0]/100,
            cutend:this.state.dur*value[1]/100,
        })
        //更新当前视频显示进度
        this.video.current.currentTime=this.state.dur*value[0]/100
    }
    formatter(value) {
        return this.secondToDate(this.state.dur*value/100);
    }
    playFragment(e){
        console.log('play0: ', this.state.cutend);
        this.video.current.currentTime=this.state.cutstart;
        this.video.current.play();
        console.log('play1: ', this.state.cutend);
    }
    render(){
        // const url = 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400'
        // const url = "http://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_h264.mov#t=10,20"
        const url = "http://192.168.71.201:8080/mediaPlay/test.mp4"
        // const url = "http://111.230.89.209/doc/Redial.mp4"
        // const url = "http://192.168.71.23/video/thevoice.mp4"
        const marks = {
            0: '00:00:00',
            100: this.secondToDate(this.state.dur),
        };
        return (
            <div className='center' >
                <video src={url} muted='muted' ref={this.video} preload='meta' width='500px'
                        controls='controls' onCanPlay={this.onCanPlay} onLoadedmetadata={this.onLoadedmetadata}
                        onTimeUpdate={this.onTimeUpdate}>
                    Sorry! Your browser does not support HTML5 video.
                </video>

                <p>播放进度：{this.secondToDate(this.state.cur)}/{this.secondToDate(this.state.dur)}</p>
                <div className='width'>
                    <Slider marks={marks} range defaultValue={[0, 100]} onChange={this.onChange}
                            tipFormatter={this.formatter} />

                </div>
                <div >
                <p>分割片段长度：{this.secondToDate(this.state.cutstart)}-{this.secondToDate(this.state.cutend)}</p>
                {/* <Button type="primary" onClick={this.playFragment}>播放片段</Button> */}
                </div>
                <FragmentVideo url={url} cutstart={this.state.cutstart} cutend={this.state.cutend}/>
            </div>

        )
    }
}
export default Video;