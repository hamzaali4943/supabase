import useSupabase from 'src/boot/supabase'
import moment from 'moment'
export default function useApi() {
  const { supabase } = useSupabase()

  const list = async (table) => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
    if (error) throw error
    return data
  }

  const getById = async (table, id) => {
    const { data, error } = await supabase
      .from(table)
      .select(`* ,
      orditm:orditm ( * ),
      ordtrl:ordtrl ( ord_id)`)
      .eq('ord_id', id)
    if (error) throw error
    return data[0]
  }
  const getUnmatchFasitm = async (table = "fasitm") => {
    const { data, error } = await supabase
      .from(table)
      .select(`orl_upi,invDate, invRef, itemName,fas_id`)
      .is('matchAt', null)
    if (error) throw error
    return data
  }

  const getUnmatchOdritm = async (table = "orditm") => {
    const { data, error } = await supabase
      .from(table)
      .select(`orl_upi,orl_itemName,orl_id,ord_id ,
      ordhdr:ordhdr ( ord_createAt,ord_num)`)
      .is('matchAt', null)
      .not('orl_upi', 'eq', null)
    if (error) throw error
    return data
  }
  const autoMatchSingle = async (table = "orditm", id) => {
    const { data, error } = await supabase
      .from(table)
      .select(`orl_upi,ord_id`)
      .eq('orl_id', id)
    if (error) throw error
    if (data) {
      let res = await getFasByUpi("fasitm", data[0].orl_upi)
      if (res[0]) {
        await updateMatchAt("fasitm", { orl_upi: data[0].orl_upi, matchAt: moment().format("YYYY-MM-DD"), ord_id: data[0].ord_id });
        await updateMatchAt("orditm", { orl_upi: data[0].orl_upi, matchAt: moment().format("YYYY-MM-DD"), fas_id: res[0].fas_id })
        return true
      } else {
        return false
      }
    }
    return false;
  }

  const getFasByUpi = async (table = "fasitm", upi) => {
    const { data, error } = await supabase
      .from(table)
      .select(`*`)
      .eq('orl_upi', upi)
    if (error) throw error
    return data
  }



  const autoMatch = async (table = "orditm") => {
    let unmatchOdritm = await getUnmatchOdritm();
    let unmatchFasitm = await getUnmatchFasitm();
    let fasitm = [], orditm = [];
    if (unmatchOdritm.length && unmatchFasitm.length) {
      // console.log(unmatchFasitm)
      // console.log(unmatchOdritm)
      // const matched = unmatchOdritm.filter(n => unmatchFasitm.some(n2 => n.orl_upi == n2.orl_upi));

      unmatchOdritm.forEach(n => {
        unmatchFasitm.forEach(n2 => {
          if (n.orl_upi == n2.orl_upi) {
            fasitm.push({ orl_upi: n.orl_upi, matchAt: moment().format("YYYY-MM-DD"), ord_id: n.ord_id, fas_id: n2.fas_id })
            orditm.push({ ord_id: n.ord_id, orl_id: n.orl_id, orl_upi: n.orl_upi, matchAt: moment().format("YYYY-MM-DD"), fas_id: n2.fas_id })
            return;
          }
        })
      });

      // console.log(matched)
      // for (let index = 0; index < matched.length; index++) {
      //   const element = matched[index];
      //   // issue in updating fasitm.orl_id
      //   fasitm.push({ orl_upi: element.orl_upi, matchAt: moment().format("YYYY-MM-DD"), ord_id: element.ord_id })
      //   orditm.push({ ord_id: element.ord_id, orl_id: element.orl_id, orl_upi: element.orl_upi, matchAt: moment().format("YYYY-MM-DD") })
      // }
    }
    if (fasitm.length) {
      fasitm = [...new Map(fasitm.map(item => [item['orl_upi'], item])).values()];
      let fasUpdated = await createOrUpdate("fasitm", fasitm)
      let ordUpdated = await createOrUpdate("orditm", orditm)

      return { fasUpdated, ordUpdated }
    }
    return unmatchOdritm;
  }

  const getMatchFasitm = async (table = 'fasitm', startDate, endDate, company) => {
    if (!startDate) {
      startDate = moment('2020/11/30', "YYYY-MM-DD").format("YYYY-MM-DD");
    }
    if (!endDate)
      endDate = moment().format("YYYY-MM-DD");

    let query = supabase
      .from(table)
      .select('*')
      .order('matchAt', { ascending: false })
    if (company) { query = query.eq('company', company) }
    if (startDate) { query = query.gte('matchAt', startDate.toString()) }
    if (endDate) { query = query.lte('matchAt', endDate.toString()) }

    const { data, error } = await query;
    // console.log(data)
    if (error) throw error
    return data
  }
  const getCommentsById = async (table, id) => {
    const { data, error } = await supabase
      .from(table)
      .select(`comments`)
      .eq('ord_id', id)
    if (error) throw error
    return data[0]
  }


  const post = async (table, form) => {
    const { data, error } = await supabase
      .from(table)
      .insert([
        {
          ...form
        }
      ])
    if (error) throw error
    return data
  }

  const updateMatchAt = async (table, form) => {
    console.log("form", form)
    const { data, error } = await supabase
      .from(table)
      .update({ ...form })
      .match({ orl_upi: form.orl_upi })
    if (error) throw error
    return data
  }

  const update = async (table, form) => {
    if (form.comments) {
      let previous = await getCommentsById(table, form.ord_id)
      if (previous.comments)
        previous = previous.comments;
      else
        previous = []
      form.comments = [...previous, form.comments]
    }
    const { data, error } = await supabase
      .from(table)
      .update({ ...form })
      .match({ ord_id: form.ord_id })
    if (error) throw error
    return data
  }

  const remove = async (table, ord_id) => {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .match({ ord_id })
    if (error) throw error
    return data
  }

  const createOrUpdate = async (table, items) => {
    const { data, error } = await supabase
      .from(table)
      .upsert(items)
    if (error) {
      console.log(error)
      throw error
    }
    return data
  }

  const customLogic = async (table, items, file) => {
    let success = items.length

    //get list of matching ids
    if (table == 'ordhdr') {
      let ids = items.map(e => e.ord_id);
      const { data, error } = await supabase
        .from(table)
        .select('ord_id,ord_updateAt')
        .in('ord_id', ids)
      if (error) throw error
      if (data.length) {
        const ordtrl = items.filter(a => data.some(b => (a.ord_id == b.ord_id) && (new Date(a.ord_updateAt) > new Date(b.ord_updateAt))));
        const { data1, error } = await supabase
          .from('ordtrl')
          .upsert(ordtrl)
        if (error) throw error
        success = success - ordtrl.length
      }
    }

    await post("logs", { filename: file })
    await createOrUpdate(table, items);
    return { success: success }
  }

  const getByDate = async (table = 'ordhdr', startDate, endDate, company) => {
    if (!startDate) {
      startDate = moment('2021/4/12', "YYYY-MM-DD").format("YYYY-MM-DD");
    }
    if (!endDate)
      endDate = moment().format("YYYY-MM-DD");

    let query = supabase
      .from(table)
      .select('ord_id, ord_num, ord_createAt, ord_amtTotal, comments')
      .order('ord_id', { ascending: false })
    if (company) { query = query.eq('company', company) }
    if (startDate) { query = query.gte('ord_createAt', startDate.toString()) }
    if (endDate) { query = query.lte('ord_createAt', endDate.toString()) }

    const { data, error } = await query;

    if (error) throw error
    data.forEach(e => {
      if (e.comments)
        e.comments = true;
      else
        e.comments = false;

    })
    return data
  }


  return {
    list,
    getById,
    getCommentsById,
    post,
    update,
    remove,
    createOrUpdate,
    customLogic,
    getByDate
  }
}









