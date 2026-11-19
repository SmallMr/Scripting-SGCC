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
import { loadUsageFeed, sendDeviceCode, toErrorMessage } from '../core/gateway'
import {
  clearUsageSnapshot,
  readAccountSecret,
  readWidgetSettings,
  writeAccountSecret,
  writeWidgetSettings
} from '../core/settings'
import type { CompactStyle, WidgetSettings } from '../core/settings'

/** 只接受正整数的输入行。 */
function NumericRow({
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
          const parsed = Number(next)
          if (Number.isInteger(parsed) && parsed > 0) onChanged(parsed)
        }}
      />
    </HStack>
  )
}

/**
 * 设置页：账号信息放在这里，偏好存 `Storage`（小组件读取），密码进钥匙串。
 * 任何一项变化都会重载桌面小组件。
 */
export function SettingsScreen() {
  const dismiss = Navigation.useDismiss()
  const [settings, setSettings] = useState<WidgetSettings>(() =>
    readWidgetSettings()
  )
  const [password, setPasswordText] = useState(() => readAccountSecret())
  const [sending, setSending] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    writeWidgetSettings(settings)
    Widget.reloadAll()
  }, [settings])

  useEffect(() => {
    writeAccountSecret(password)
  }, [password])

  const patch = (changes: Partial<WidgetSettings>) =>
    setSettings((previous) => ({ ...previous, ...changes }))

  const handlePhoneChange = (phone: string) => {
    // 换账号后，上一个账号的缓存不能继续显示
    if (phone !== settings.phone) clearUsageSnapshot()
    patch({ phone })
  }

  const handleSendCode = async () => {
    setSending(true)
    try {
      const masked = await sendDeviceCode()
      await Dialog.alert({
        title: '短信验证码已发送',
        message: `验证码已发至 ${masked}，请在 15 分钟内填入「短信验证码」后预览组件`
      })
    } catch (error) {
      console.error(error)
      await Dialog.alert({ title: '发送失败', message: toErrorMessage(error) })
    } finally {
      setSending(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const { list, error } = await loadUsageFeed({ force: true })
      const ok = list.filter(Boolean).length
      await Dialog.alert({
        title: error ? '刷新失败，已使用缓存' : '刷新成功',
        message: error ?? `已获取 ${ok} 个户号的数据`
      })
      Widget.reloadAll()
    } catch (error) {
      console.error(error)
      await Dialog.alert({ title: '刷新失败', message: toErrorMessage(error) })
    } finally {
      setRefreshing(false)
    }
  }

  const handleClearCache = async () => {
    clearUsageSnapshot()
    Widget.reloadAll()
    await Dialog.alert({
      title: '已清除',
      message: '下次刷新将重新请求国网数据'
    })
  }

  const openWidgetPreview = async () => {
    try {
      await Widget.preview()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <NavigationStack>
      <List
        navigationTitle="网上国网用电"
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
            value={settings.phone}
            keyboardType="phonePad"
            onChanged={handlePhoneChange}
          />
          <SecureField
            title="密码"
            prompt="密码"
            value={password}
            onChanged={setPasswordText}
          />
          <Button action={handleSendCode} disabled={sending}>
            <HStack>
              <Text>发送短信验证码</Text>
              <Spacer />
              {sending ? <ProgressView /> : null}
            </HStack>
          </Button>
          <TextField
            title="短信验证码"
            prompt="短信验证码"
            value={settings.smsCode}
            keyboardType="numberPad"
            onChanged={(smsCode: string) => patch({ smsCode })}
          />
        </Section>

        <Section header={<Text>数据</Text>}>
          <Button action={handleRefresh} disabled={refreshing}>
            <HStack>
              <Text>立即刷新</Text>
              <Spacer />
              {refreshing ? <ProgressView /> : null}
            </HStack>
          </Button>
          <Button title="清除数据缓存" role="destructive" action={handleClearCache} />
        </Section>

        <Section
          header={<Text>阶梯</Text>}
          footer={
            <Text>按年累计电量计算，单位：度。第二阶梯上限需要大于第一阶梯上限。</Text>
          }
        >
          <NumericRow
            title="第一阶梯上限"
            value={settings.oneLevelPq}
            onChanged={(oneLevelPq) => patch({ oneLevelPq })}
          />
          <NumericRow
            title="第二阶梯上限"
            value={settings.twoLevelPq}
            onChanged={(twoLevelPq) => patch({ twoLevelPq })}
          />
        </Section>

        <Section
          header={<Text>小号组件</Text>}
          footer={
            <Text>只影响小号组件；摘要默认显示本月、昨日和上月，三项列表显示昨日 / 本月 / 上月，四项列表再包含本年。</Text>
          }
        >
          <Picker
            title="显示方式"
            value={settings.smallWidgetMode}
            onChanged={(value: string) =>
              patch({ smallWidgetMode: value as CompactStyle })
            }
            pickerStyle="segmented"
          >
            <Text tag="modules">摘要</Text>
            <Text tag="three">三项列表</Text>
            <Text tag="compact">四项列表</Text>
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
            value={String(settings.refreshHours)}
            onChanged={(value: string) =>
              patch({ refreshHours: Number(value) })
            }
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
          <Button title="预览小组件" action={openWidgetPreview} />
        </Section>
      </List>
    </NavigationStack>
  )
}
