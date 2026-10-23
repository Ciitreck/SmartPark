import { NativeTabs } from 'expo-router/native-tabs';

import { FontFamily } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function AppTabs() {
  const theme = useTheme();

  return (
    <NativeTabs
      tintColor={theme.accent}
      backgroundColor={theme.surface200}
      indicatorColor={theme.brandSoft}
      rippleColor={theme.brandSoft}
      iconColor={{ default: theme.inkMuted, selected: theme.accent }}
      labelStyle={{
        default: { fontFamily: FontFamily.sansMedium, fontSize: 12, color: theme.inkMuted },
        selected: { fontFamily: FontFamily.sansBold, fontSize: 12, color: theme.accent },
      }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Lugares</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="parkingsign.circle" md="local_parking" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="stay">
        <NativeTabs.Trigger.Label>Estancia</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="clock" md="schedule" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="panel">
        <NativeTabs.Trigger.Label>Panel</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="chart.bar" md="bar_chart" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="account">
        <NativeTabs.Trigger.Label>Cuenta</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'person', selected: 'person.fill' }} md={{ default: 'person_outline', selected: 'person' }} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
