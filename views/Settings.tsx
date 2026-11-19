import {
  Button,
  HStack,
  List,
  Navigation,
  NavigationStack,
  Picker,
  ProgressView,
  SecureField,
  Section,
  Spacer,
  Text,
  TextField,
  Widget,
  useEffect,
  useState
} from 'scripting'
import { errorMessage, getData, sendSms } from '../api/client'
import {
  clearCache,
  getPassword,
  loadPreference,
  savePreference,
  setPassword
} from '../store'
import type { Preference, SmallWidgetMode } from '../store'

/** A whole-number field that only commits positive values. */
function NumberField({
  title,
  value,
  onChanged
}: {
  title: string
  value: number
  onChanged: (value: number) => void
}) {
  const [text, setText] = useState(String(value))
  return (
    <HStack>
      <Text>{title}</Text>
      <Spacer />
      <TextField
        title={title}
        value={text}
        keyboardType="numberPad"
        multilineTextAlignment="trailing"
        frame={{ width: 100 }}
        onChanged={(next: string) => {
          setText(next)
          const n = Number(next)
          if (Number.isInteger(n) && n > 0) onChanged(n)
        }}
      />
    </HStack>
  )
}

/**
 * The whole app: the settings the Scriptable version kept in `withSettings`.
 * Preferences live in `Storage` (read by the widget), the password in the
 * Keychain; every change reloads the widgets.
 */
export function Settings() {
  const dismiss = Navigation.useDismiss()
  const [preference, setPreference] = useState<Preference>(() => loadPreference())
  const [password, setPasswordText] = useState(() => getPassword())
  const [sending, setSending] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    savePreference(preference)
    Widget.reloadAll()
  }, [preference])

  useEffect(() => {
    setPassword(password)
  }, [password])

  const update = (patch: Partial<Preference>) =>
    setPreference((prev) => ({ ...prev, ...patch }))

  const changePhone = (phone: string) => {
    // Data cached for another account must not show up under the new one.
    if (phone !== preference.phone) clearCache()
    update({ phone })
  }

  const onSendSms = async () => {
    setSending(true)
    try {
      const masked = await sendSms()
      await Dialog.alert({
        title: '短信验证码已发送',
        message: `验证码已发至 ${masked}，请在 15 分钟内填入「短信验证码」后预览组件`
      })
    } catch (e) {
      console.error(e)
      await Dialog.alert({ title: '发送失败', message: errorMessage(e) })
    } finally {
      setSending(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      const { list, error } = await getData({ force: true })
      const ok = list.filter(Boolean).length
      await Dialog.alert({
        title: error ? '刷新失败，已使用缓存' : '刷新成功',
        message: error ?? `已获取 ${ok} 个户号的数据`
      })
      Widget.reloadAll()
    } catch (e) {
      console.error(e)
      await Dialog.alert({ title: '刷新失败', message: errorMessage(e) })
    } finally {
      setRefreshing(false)
    }
  }

  const onClearCache = async () => {
    clearCache()
    Widget.reloadAll()
    await Dialog.alert({ title: '已清除', message: '下次刷新将重新请求国网数据' })
  }

  const preview = async () => {
    try {
      await Widget.preview()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <NavigationStack>
      <List
        navigationTitle="网上国网"
        toolbar={{
          cancellationAction: <Button title="完成" action={dismiss} />
        }}
      >
        <Section
          header={<Text>网上国网账号</Text>}
          footer={
            <Text>首次登录（新设备）需要短信验证：先发送验证码，再把 6 位验证码填入下方后刷新。</Text>
          }
        >
          <TextField
            title="手机号"
            prompt="手机号"
            value={preference.phone}
            keyboardType="phonePad"
            onChanged={changePhone}
          />
          <SecureField
            title="密码"
            prompt="密码"
            value={password}
            onChanged={setPasswordText}
          />
          <Button action={onSendSms} disabled={sending}>
            <HStack>
              <Text>发送短信验证码</Text>
              <Spacer />
              {sending ? <ProgressView /> : null}
            </HStack>
          </Button>
          <TextField
            title="短信验证码"
            prompt="短信验证码"
            value={preference.smsCode}
            keyboardType="numberPad"
            onChanged={(smsCode: string) => update({ smsCode })}
          />
        </Section>

        <Section header={<Text>数据</Text>}>
          <Button action={onRefresh} disabled={refreshing}>
            <HStack>
              <Text>立即刷新</Text>
              <Spacer />
              {refreshing ? <ProgressView /> : null}
            </HStack>
          </Button>
          <Button title="清除数据缓存" role="destructive" action={onClearCache} />
        </Section>

        <Section
          header={<Text>阶梯</Text>}
          footer={
            <Text>按年累计电量计算，单位：度。第二阶梯上限需要大于第一阶梯上限。</Text>
          }
        >
          <NumberField
            title="第一阶梯上限"
            value={preference.oneLevelPq}
            onChanged={(oneLevelPq) => update({ oneLevelPq })}
          />
          <NumberField
            title="第二阶梯上限"
            value={preference.twoLevelPq}
            onChanged={(twoLevelPq) => update({ twoLevelPq })}
          />
        </Section>

        <Section
          header={<Text>小号组件</Text>}
          footer={<Text>只影响小号组件；三项为昨日 / 本月 / 上月，四项列表和四项模块都包含本年。</Text>}
        >
          <Picker
            title="显示方式"
            value={preference.smallWidgetMode}
            onChanged={(value: string) =>
              update({ smallWidgetMode: value as SmallWidgetMode })
            }
            pickerStyle="segmented"
          >
            <Text tag="three">三项</Text>
            <Text tag="compact">四项列表</Text>
            <Text tag="modules">四项模块</Text>
          </Picker>
        </Section>

        <Section
          header={<Text>数据更新</Text>}
          footer={
            <Text>缓存超过该时长后，小组件下次刷新会重新请求国网数据；国网接口有缓存，建议不低于 4 小时。</Text>
          }
        >
          <Picker
            title="更新时间"
            value={String(preference.refreshHours)}
            onChanged={(value: string) => update({ refreshHours: Number(value) })}
          >
            <Text tag="4">4 小时</Text>
            <Text tag="6">6 小时</Text>
            <Text tag="8">8 小时</Text>
            <Text tag="12">12 小时</Text>
            <Text tag="24">24 小时</Text>
          </Picker>
        </Section>

        <Section
          header={<Text>预览</Text>}
          footer={
            <Text>多户号：长按桌面小组件 → 编辑小组件 → 参数，填从 0 开始的整数，0 为第一户，1 为第二户，以此类推。</Text>
          }
        >
          <Button title="预览小组件" action={preview} />
        </Section>
      </List>
    </NavigationStack>
  )
}
