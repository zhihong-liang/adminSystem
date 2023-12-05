import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
    minimum: 0.3,
    easing: 'ease',
    speed: 800,
    showSpinner: false,
    trickleSpeed: 200,
    // parent: 'cn_container'
});

export const start = () => {
    NProgress.start();
};

export const close = () => {
    NProgress.done();
};