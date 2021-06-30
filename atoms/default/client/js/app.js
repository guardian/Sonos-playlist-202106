// if you want to import a module from shared/js then you can
// just do e.g. import Scatter from "shared/js/scatter.js"
// if you want to import a module from shared/js then you can
// just do e.g. import Scatter from "shared/js/scatter.js"
import { render, h } from "preact";
import SocialBar from 'shared/js/SocialShare';
import {$, $$} from 'shared/js/util';
import RelatedContent from "shared/js/RelatedContent";
import {gsap, Sine} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import store, {ACTION_PAUSE_AUDIO, ACTION_SET_LEVEL, ACTION_SET_MUTED, fetchData} from "./store";
import {Provider, useSelector, useDispatch} from "react-redux";
import { useEffect, useRef, useState } from "preact/hooks";
import AudioPlayer from "../../../../shared/js/AudioPlayer";
import DoubleArrowIcon from "./DoubleArrowIcon";
import {Transition} from "react-transition-group";
import { Muted, Unmuted } from "./Icons";


const assetsPath = "<%= path %>";

gsap.registerPlugin(ScrollTrigger);

const Container = ({children}) => {
    return (
        <div className="container">
            {children}
        </div>
    )
}
// const FlexContainer = (props) => {
const FlexContainer = ({children, className}) => {
    return (
        <div className={`flex-container ${className}`} >
            {children}
        </div>
    )
}
const PaddedContainer = ({children, className}) => {
    return (
        <div className={`padded-container ${className}`} >
            {children}
        </div>
    )
}

const PaidForBy = () => {
    const link = useSelector(s=>s.sheets.global[0].logoLink);
    
    return (
        <FlexContainer className="paid-for fl-col" >
            <p>Paid for by</p>
            <a href={link} target='_blank'><img src={`${assetsPath}/logo.png`} width="82"/></a>
        </FlexContainer>
    )
}

const setHtml = (html) => ({__html: html});

const AudioControl = () => {
    const audioLayers = useSelector(s=>s.audioLayers);
    const level = useSelector(s=>s.currentLevel);
    // const baseTrack = useSelector(s=> '0_'+ s.sheets.options.filter(v=> 0 == v.group))[0].tag;
    const baseTrack = '0_baselayer';
    const [aud, setAudio] = useState(new Audio());
    const [aud2, setAudio2] = useState(null);
    const [track, setTrack] = useState('')
    const muted = useSelector(s=>s.muted);

    const pauseAudio = useSelector(s=>s.pauseAudio);

    useEffect(()=>{
        if (pauseAudio) {
            gsap.killTweensOf(aud)
            gsap.to(aud, {duration: 1, volume: 0, onComplete: aud.pause});
        }
    },[pauseAudio])

    const toggleMute = () => {
        useDispatch()({type:ACTION_SET_MUTED, payload: !muted});
    }

    useEffect(() => {
        if (audioLayers.length) {
            const ntrack = audioLayers.reduce((p,c,i)=>p? `${p}_${c.tag}`: c?c.tag : '', '');
            if (track !== ntrack) {
                setTrack(ntrack);
                if (aud2) {
                    gsap.killTweensOf(aud2);
                    aud2.pause();
                    aud2.oncanplaythrough = null;
                }
                const aud2 = new Audio();
                aud2.oncanplaythrough = () => {
                    console.log('playthrough', aud2.src)
                    aud2.oncanplaythrough = null;
                    aud2.currentTime = aud.currentTime;
                    aud2.play();
                    console.log('audiot loaded')
                    gsap.to(aud, {volume: 0, duration: 2, onComplete: () => {
                        aud.pause();
                    }})
                    gsap.from(aud2, {volume: 0, duration: 2, onComplete: () => {
                    }})
                    setAudio(aud2)
                    setAudio2(null);
                    
                }
                aud2.src = `${assetsPath}/audio/${level-1}_${ntrack}.mp3`;
                aud2.loop = true;
                setAudio2(aud2);
                aud2.load();
                console.log('audio track', level, ntrack)
            } else {
                aud.src = `${assetsPath}/audio/${baseTrack}.mp3`;
            }
        } 
    },[audioLayers])

    useEffect(()=> {
        aud.autoplay = true;
        aud.loop = true;
        aud.load();
        aud.src = `${assetsPath}/audio/${baseTrack}.mp3`;
    },[]);
    // console.log('audioctrl', audioLayers);

    const handleMute = (e) => {
        e.preventDefault();
        aud.muted = !muted;
        toggleMute();
    }
    return (
        <div>
        <a href="#" role="button" onClick={handleMute}>
            
                {/* { aud.muted && <img src={`${assetsPath}/mute.png`} /> }
                { !aud.muted && <img src={`${assetsPath}/unmute.png`} /> } */}
                { aud.muted && <Muted /> }
                { !aud.muted && <Unmuted /> }
            </a>
        </div>
    )
}

const ContentPanel = ({className, children}) => 
    <div className={`content-panel ${className || ''}`}>
        {children}
    </div>

const Layer0Panel = (props) => {
    const dispatch = useDispatch();
    const globalData = useSelector(s=>s.sheets.global[0]);

    const handleClick = (e) => {
        e.preventDefault();
        dispatch({type:ACTION_SET_LEVEL, payload: {level: 1, option: null}})
    }

    const elref = useRef();

    const content = useSelector(s=>s.content);

    useEffect(()=>{
        console.log(elref.current)
        gsap.from(elref.current, {alpha: 0, y: 20})
    },[])

    return (

        <FlexContainer className="fl-col intro-panel panel-body">
            <h1 className="title shadowed" dangerouslySetInnerHTML={setHtml(content.introHead)}></h1>
            <h2 dangerouslySetInnerHTML={setHtml(content.introSub)}></h2>
            <div dangerouslySetInnerHTML={setHtml(content.introBody)}></div>

            <a href="#" role="button" className="default-btn" onClick={handleClick} ref={el=>console.log('>>',el)}><span dangerouslySetInnerHTML={setHtml(content.introButton)}>Get started</span> <DoubleArrowIcon /></a>
        </FlexContainer>
    )
}
const Layer1Panel = (props) => {
    const dispatch = useDispatch();
    const data = useSelector(s=>s);
    const curL = useSelector(s=>s.currentLevel);

    const handleClick = (v) => {
        dispatch({type:ACTION_SET_LEVEL, payload:{level: parseInt(v.link), option: v}})
    }

    const elref = useRef();

    return (

        <FlexContainer className="fl-col question-panel panel-body">
            <FancyHeader>Where are you?</FancyHeader>
                {
                    data.sheets.options.filter(v=> curL == v.group).map(v=>{
                        return <a href="#" className="default-btn" key={v.key} onClick={(e)=>{e.preventDefault(); handleClick(v)}}>{v.label}</a>
                    })
                }
        </FlexContainer>
    )
}

const Playlist = (props) => {
    const data = useSelector(s=> {
        const track = s.audioLayers.slice(0, s.audioLayers.length-1).reduce((p,c,i)=>p? `${p}_${c.tag}`: c?c.tag : '', '');
        const li = s.sheets.playlists.filter(v => v.key === track);
        if (li) return li[0];
        return null;
    });

    const content = useSelector(s=>s.content);

    console.log("playlist", data);

    if (!data) return;

    useEffect(()=>{
        const ti = setInterval(()=>{
            if (document.activeElement && document.activeElement.tagName === 'IFRAME') {
                console.log('pause audio');
                clearInterval(ti);
                useDispatch()({type:ACTION_PAUSE_AUDIO, payload: true});
            }
        })
        return () => {
            clearInterval(ti);
        }        
    },[])

    return (
        <FlexContainer className="fl-col playlist-panel panel-body">
            <h1>{data.title}</h1>
            <iframe src={data.link} width="100%" height="100%" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
            <div className="share">
                <span>{content.sharePrompt}</span>
                <SocialBar title={content.shareTitle} url={content.shareUrl} />
            </div>
            <div className="tnc" dangerouslySetInnerHTML={setHtml(content.playlistFooter)}>

            </div>
        </FlexContainer>
    )
}

const FancyHeader = (props) => {
    return (
        <h1 className="shadowed">{props.children}</h1>
    )
}

const Header = () => {
    const globalData = useSelector(s=>s.sheets.global[0]);
    const store = useSelector(s=>s);

    useEffect(() => {
        // gsap.from('.title',{duration: 1, y: 20, alpha: 0, delay: 3});
    },[])

    const getLevel = () => {
        switch (store.currentLevel) {
            case 0: 
                return <Layer0Panel />
            case 4:
                return <Playlist />
            default:
                return <Layer1Panel />
        }
    }

    return (
        <div className="fullh main-panel">

            <FlexContainer className="fl-space-between">
                <PaidForBy/>
                <AudioControl />

            </FlexContainer>

            <ContentPanel className="">
                <FlexContainer className="fullh">

                    {getLevel()}

                </FlexContainer>

            </ContentPanel>
        </div>
    )
}

const Panel = ({className, children}) => <div className={`panel ${className}`}>{children}</div>;

const ImagePanel = ({className, children, image}) => {
    const bgRef = useRef();

    useEffect(()=>{
        ScrollTrigger.create({
            trigger: bgRef.current,
            start: "top bottom",
            animation: gsap.to(bgRef.current, {scale: 1.1}),
            scrub: true
          });
    },[]);

    return <Panel className="image-panel">
        <div className="bg-container" style={{backgroundImage: `url(${image})`}} ref={bgRef}>
            {children && 
            <Container>
                {children}
            </Container>
            }
        </div>
    </Panel>
}

const AudioSection = () => 
    <Container>
        <div className="audio-article">

        </div>
    </Container>

const CenterPara = ({className, children}) => 
    <div className="center-para">
        {children}
    </div>

const LoopingBgVid = ({src, image}) => 
    <div className="video-bg">
        {image &&
        <div className="image" style={{backgroundImage: `url(<%= path %>/${image})`}} ></div>
        }
        {src && 
        <video src={`<%= path %>/${src}`} loop muted='true' autoPlay width="400" height="200" playsInline></video>
        }
    </div>

const Youtube = ({videoId, title = 'Youtube player'}) =>
    <div className="yt-vid">
        <iframe src={`https://www.youtube-nocookie.com/embed/${videoId}`} title={title} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>

const Loading = () => 
    <FlexContainer className="loading">
        <img src='<%= path %>/logo.png' width="82"/>
    </FlexContainer>

const Main = () => {
    const loaded = useSelector(s=>s.dataLoaded);
    
    const mainRef = useRef();

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch( fetchData('https://interactive.guim.co.uk/docsdata/1E3p9RuXgwxZHhFjl4K5qmXnht2Sp7DSTgs3LOLXAXnY.json') );
    },[]);

    if (!loaded) {
        return <Loading />;
    } else {
        const contentData = useSelector(s=>s.sheets.content);
        const cta = useSelector(s=>s.sheets.global[0].cta);
        const globalData = useSelector(s=>s.sheets.global[0]);
        const relatedItems = useSelector(s=>s.sheets.related);
        const store = useSelector(s=>s);

        const [data, setData] = useState({});

        const relatedList = relatedItems.map(v=>
            <li>
                <a href={v.link}>
                    <img src={`<%= path %>/${v.image}`} alt=""/>
                    <div dangerouslySetInnerHTML={setHtml(v.content)}></div>
                </a>
            </li>);

        useEffect(() => {
            const d = {cta};
            contentData.forEach(v => d[v.key] = v.content)

            setData(d);
            // gsap.to(mainRef.current, {delay: 0.5, duration: 2, alpha: 1, ease: 'sine.out'});

            
        }, [])
        return (
            <main ref={mainRef}>
                <ImagePanel image={`${assetsPath}/pic${store.currentLevel + 1}.png`} />
                <Header />
            </main>
        );
    }
}


const App = () => {
    return (
        <Provider store={store}>
            <Main/>
        </Provider>

    )
}

render( <App/>, document.getElementById('Glabs'));
