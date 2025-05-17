import { NextPage } from 'next';
import Head from 'next/head';
import { KudoCategoriesTemplate } from '@/features/kudoCategories/presentation/templates';

const KudoCategoriesPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Kudo Categories | Kudos</title>
        <meta name="description" content="Manage your organization's kudo categories" />
      </Head>
      <KudoCategoriesTemplate />
    </>
  );
};

export default KudoCategoriesPage;
