import { useRoute} from 'vue-router'

export default function usePromission() {
    const route = useRoute()
    console.log(route);
    
}