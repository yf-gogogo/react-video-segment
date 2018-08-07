import React,{Component} from 'react';
import './FragmentVideo.css';

import 'antd/dist/antd.css';
import { Progress,Button,Spin,message,Row,Col,Slider} from 'antd';

class FragmentVideo extends Component{
    constructor(props){
        super(props);
        this.video = React.createRef()
        this.state = {
            cutstart:this.props.cutstart,
            cutend:this.props.cutend,
            disable:'disabled',
            loading:true,
            play_icon:'play-circle',
            currentTime:0,
            duration:this.props.cutend-this.props.cutstart,
            videoprogress:0,
            sound:'primary'
        }
        this.onCanPlay = this.onCanPlay.bind(this);
        this.playOrPause = this.playOrPause.bind(this);
        this.onTimeUpdate = this.onTimeUpdate.bind(this);
        this.isMute = this.isMute.bind(this);
        this.onChangeVolume = this.onChangeVolume.bind(this);
    }
    // 接收了新的属性
    componentWillReceiveProps(nextProps) {
        this.setState({
            cutstart:nextProps.cutstart,
            cutend:nextProps.cutend,
            duration:nextProps.cutend - nextProps.cutstart,
        });
        this.video.current.currentTime = this.state.cutstart;
    }
    onCanPlay(e){
        this.setState({
            disable:'',
            loading:false,
            duration:this.state.cutend-this.state.cutstart
        })

        if(this.video.current.muted){
            this.setState({
                sound:'dashed'
            })
        }else{
            this.setState({
                sound:'primary'
            })
        }
        // message.info('可以播放了')
    }
    playOrPause(e){
        if(this.video.current.currentTime > this.state.cutend){
            this.video.current.currentTime = this.state.cutstart;
        }
        // message.info(this.video.current.paused==true?'当前视频处于暂停状态':'当前视频处于播放状态')
        if(this.video.current.paused){
            
            this.video.current.play();
            this.setState({
                play_icon:'pause-circle'
            })
            message.info('播放开始')
        }else{
            message.info('播放停止')
            this.video.current.pause();
            this.setState({
                play_icon:'play-circle'
            })
        }
    }
    onTimeUpdate(e){
        // message.info(this.video.current.currentTime)
        this.setState({
            currentTime:Math.floor(this.video.current.currentTime-this.state.cutstart)<0?0:this.video.current.currentTime-this.state.cutstart,
            videoprogress: Math.floor((this.video.current.currentTime-this.state.cutstart)/this.state.duration*100)
        })

        if(this.video.current.currentTime > this.state.cutend){
            this.video.current.pause();
            this.setState({
                play_icon:'reload'
            })
            // message.info('设置按钮为play'+this.video.current.currentTime)
        }
    }
    isMute(e){
        if(this.video.current.muted){
            this.setState({
                sound:'primary'
            })
            this.video.current.muted = false;
            message.info('声音已打开',1);
        }else{
            this.setState({
                sound:'dashed'
            })
            this.video.current.muted = true;
            message.warn('声音已关闭',1);
        }
    }
    onChangeVolume(value){
        
        this.video.current.volume = value/100;
        
    }
   
   //转换时间格式 xxxxms->xx:xx:xx
    secondToDate(stime) {
        var h = Math.floor(stime / 3600) < 10 ? '0'+Math.floor(stime / 3600) : Math.floor(stime / 3600);
        var m = Math.floor((stime / 60 % 60)) < 10 ? '0' + Math.floor((stime / 60 % 60)) : Math.floor((stime / 60 % 60));
        var s = Math.floor((stime % 60)) < 10 ? '0' + Math.floor((stime % 60)) : Math.floor((stime % 60));
        // return h + ":" + m + ":" + s;
        return Math.floor(stime / 3600) > 0 ? h + ":" + m + ":" + s : m + ":" + s;
    }
    render(){
        const wxurl = 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400'
        const url = wxurl+'#t='+this.state.cutstart+','+this.state.cutend
        // const url = "http://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_h264.mov"
        const ButtonGroup = Button.Group;
        return (
            <div >
                <Spin spinning={this.state.loading} size="large">
                    <video  width='500px' preload='meta' ref={this.video} onCanPlay={this.onCanPlay}
                        onTimeUpdate={this.onTimeUpdate}>
                        <source src={url} type="video/mp4"/>
                    Sorry! Your browser does not support HTML5 video.
                    </video>
                </Spin>
                
                
                <div  >
                    {/* <Progress percent={this.state.videoprogress}  style={{ width: 400 }} />
                    <p>播放进度：{this.secondToDate(this.state.currentTime)}/{this.secondToDate(this.state.duration)}</p> */}
                    {/* <p>传递的参数：{this.secondToDate(this.state.cutstart)}-{this.secondToDate(this.state.cutend)}当前： {this.state.currentTime}</p> */}
                    <Row style={{ marginBottom: 40 }} type="flex" align="middle">
                        <Col span={1} offset={8}>
                            <Button icon="sound" type={this.state.sound} disabled={this.state.disable} onClick={this.isMute}></Button>
                        </Col>
                        <Col span={1}>
                            <Slider  onChange={this.onChangeVolume} defaultValue={100} />
                        </Col>
                        <Col span={2}>
                        {this.secondToDate(this.state.currentTime)}/{this.secondToDate(this.state.duration)}
                        </Col>
                        <Col span={3}>
                        <Progress percent={this.state.videoprogress} />
                        </Col>
                        <Col span={1}>
                            <ButtonGroup>
                                {/* <Button icon="sound" type={this.state.sound} disabled={this.state.disable} onClick={this.isMute}></Button>
                                <Button icon="minus" disabled={this.state.disable} onClick={this.minusVolume}></Button>
                                <Button icon="plus" disabled={this.state.disable} onClick={this.plusVolume}></Button> */}
                                <Button icon={this.state.play_icon} type="primary" onClick={this.playOrPause} disabled={this.state.disable}></Button>
                            </ButtonGroup>
                        </Col>
                    </Row>                  
                    
                </div>
                
            </div>
        );
    }
}
export default FragmentVideo;