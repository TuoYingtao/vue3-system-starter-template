import { defineComponent } from "vue";
import { ElOption, ElSelect } from "element-plus";
import Fuse from 'fuse.js';
import { getNormalPath } from '@/utils/ruoyi';
import { isHttp } from '@/utils/validate';
import usePermissionStore from '@/stores/modules/permission';

import './index.scss';

export default defineComponent({
  name: 'HeaderSearch',
  setup(props) {
    const search = ref('');
    const options = ref([]);
    const searchPool = ref([]);
    const show = ref(false);
    const fuse = ref(undefined);
    const headerSearchSelectRef = ref(null);
    const router = useRouter();
    const routes = computed(() => usePermissionStore().routes);

    onMounted(() => {
      searchPool.value = generateRoutes(routes.value);
    })

    watchEffect(() => {
      searchPool.value = generateRoutes(routes.value)
    })

    watch(show, (value) => {
      if (value) {
        document.body.addEventListener('click', close)
      } else {
        document.body.removeEventListener('click', close)
      }
    })

    watch(searchPool, (list) => {
      initFuse(list)
    })

    function click() {
      show.value = !show.value
      if (show.value) {
        headerSearchSelectRef.value && headerSearchSelectRef.value.focus()
      }
    };
    function close() {
      headerSearchSelectRef.value && headerSearchSelectRef.value.blur()
      options.value = []
      show.value = false
    }
    function change(val?: Record<string, any>) {
      const path = val.path;
      if (isHttp(path)) {
        // http(s):// 路径新窗口打开
        const pindex = path.indexOf("http");
        window.open(path.substr(pindex, path.length), "_blank");
      } else {
        router.push(path)
      }

      search.value = ''
      options.value = []
      nextTick(() => {
        show.value = false
      })
    }
    function initFuse(list) {
      fuse.value = new Fuse(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        minMatchCharLength: 1,
        keys: [{
          name: 'title',
          weight: 0.7
        }, {
          name: 'path',
          weight: 0.3
        }]
      })
    }
    // Filter out the routes that can be displayed in the sidebar
    // And generate the internationalized title
    function generateRoutes(routes, basePath = '', prefixTitle = []) {
      let res = []

      for (const r of routes) {
        // skip hidden router
        if (r.hidden) { continue }
        const p = r.path.length > 0 && r.path[0] === '/' ? r.path : '/' + r.path;
        const data = {
          path: !isHttp(r.path) ? getNormalPath(basePath + p) : r.path,
          title: [...prefixTitle]
        }

        if (r.meta && r.meta.title) {
          data.title = [...data.title, r.meta.title]

          if (r.redirect !== 'noRedirect') {
            // only push the routes with title
            // special case: need to exclude parent router without redirect
            res.push(data)
          }
        }

        // recursive child routes
        if (r.children) {
          const tempRoutes = generateRoutes(r.children, data.path, data.title)
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes]
          }
        }
      }
      return res
    }
    function querySearch(query?: string) {
      if (query !== '') {
        options.value = fuse.value.search(query)
      } else {
        options.value = []
      }
    }

    const renderOption = () => options.value.map((option) => <ElOption key={option.item.path} value={option.item} label={option.item.title.join(' > ')}/>);

    const renderSelect = () => <ElSelect
        class="header-search-select"
        ref="headerSearchSelectRef"
        modelValue={search.value}
        remoteMethod={() => querySearch()}
        filterable={true}
        defaultFirstOption={true}
        remote={true}
        placeholder={'Search'}
        onChange={() => change()}
        v-slots={{
          default: renderOption()
        }}
    />

    const renderHeaderSearch = () => <div class={['header-search', show.value && 'show']}>
      <svg-icon class-name="search-icon" icon-class="search" onClick={(e: MouseEvent) => {
        e.stopPropagation();
        click();
      }} />
      {renderSelect()}
    </div>

    return {};
  },
  render() {

  },
})
